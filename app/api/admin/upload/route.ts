import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAuthenticatedAdmin } from '@/lib/auth';

// Max upload size: 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * SSRF Protection: block requests to private/internal IP ranges and
 * non-http(s) schemes. Only allow fetching from public internet URLs.
 */
function isSafeUrl(rawUrl: string): { safe: boolean; reason?: string } {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { safe: false, reason: 'URL invalide' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { safe: false, reason: 'Seuls les protocoles HTTP/HTTPS sont autorisés' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost variants
  if (hostname === 'localhost' || hostname === '0.0.0.0') {
    return { safe: false, reason: 'Accès aux ressources locales interdit' };
  }

  // Block private IPv4 ranges (RFC 1918 + link-local + loopback)
  const privateRanges = [
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^169\.254\./,  // link-local (AWS metadata)
    /^100\.64\./,   // CGNAT
  ];
  for (const range of privateRanges) {
    if (range.test(hostname)) {
      return { safe: false, reason: 'Accès aux adresses IP privées interdit' };
    }
  }

  // Block IPv6 loopback / link-local
  if (hostname === '::1' || hostname.startsWith('fe80:') || hostname === '[::1]') {
    return { safe: false, reason: 'Accès aux adresses IPv6 locales interdit' };
  }

  return { safe: true };
}

async function fetchExternalFile(targetUrl: string): Promise<{ buffer: Buffer; mimeType: string; name: string } | { error: string; status: number }> {
  const safety = isSafeUrl(targetUrl);
  if (!safety.safe) {
    return { error: `URL refusée : ${safety.reason}.`, status: 400 };
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, { redirect: 'follow' });
  } catch (err: any) {
    return { error: `Impossible d'atteindre l'URL fournie : ${err.message}`, status: 400 };
  }

  if (!response.ok) {
    return { error: `Impossible de récupérer le fichier depuis l'URL (HTTP ${response.status}).`, status: 400 };
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get('content-type') || 'application/octet-stream';
  const parsedPath = new URL(targetUrl).pathname;
  const name = path.basename(parsedPath) || `remote_${Date.now()}`;

  return { buffer, mimeType, name };
}

export async function POST(req: NextRequest) {
  try {
    // --- Fix #2: Authentication required ---
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let fileBuffer: Buffer | null = null;
    let originalName = 'upload';
    let mimeType = 'image/webp';
    let requestedFolder = 'images';

    if (contentType.includes('application/json')) {
      // Direct URL download mode: { url: "https://..." }
      const body = await req.json();
      const targetUrl = body.url;
      requestedFolder = body.folder || 'images';

      if (!targetUrl) {
        return NextResponse.json(
          { error: "Veuillez fournir une URL valide (commençant par https://)." },
          { status: 400 }
        );
      }

      // --- Fix #3: SSRF protection ---
      const result = await fetchExternalFile(targetUrl);
      if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      ({ buffer: fileBuffer, mimeType, name: originalName } = result);

    } else {
      // Multipart form data mode
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const urlInput = formData.get('url') as string | null;
      requestedFolder = (formData.get('folder') as string) || 'images';

      if (urlInput) {
        // --- Fix #3: SSRF protection ---
        const result = await fetchExternalFile(urlInput);
        if ('error' in result) {
          return NextResponse.json({ error: result.error }, { status: result.status });
        }
        ({ buffer: fileBuffer, mimeType, name: originalName } = result);
      } else if (file) {
        const bytes = await file.arrayBuffer();
        fileBuffer = Buffer.from(bytes);
        mimeType = file.type;
        originalName = file.name;
      } else {
        return NextResponse.json(
          { error: 'Aucun fichier ni URL valide fourni.' },
          { status: 400 }
        );
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json({ error: 'Le fichier reçu est vide.' }, { status: 400 });
    }

    // --- Fix #12: File size limit ---
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Taille maximale autorisée : 50 Mo (reçu : ${(fileBuffer.length / 1024 / 1024).toFixed(1)} Mo).` },
        { status: 413 }
      );
    }

    // Determine type: Video vs Document vs Image
    const isVideo =
      mimeType.includes('video') ||
      requestedFolder === 'videos' ||
      Boolean(originalName.match(/\.(mp4|webm|mov|avi|mkv|ogv|m4v)$/i));

    const isDoc =
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('sheet') ||
      Boolean(originalName.match(/\.(pdf|docx?|xlsx?|pptx?|txt|csv|zip)$/i));

    let subFolder = 'images';
    if (isVideo || requestedFolder === 'videos') {
      subFolder = 'videos';
    } else if (isDoc || requestedFolder === 'documents') {
      subFolder = 'documents';
    }

    // Sanitize filename
    const cleanRaw = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    let ext = path.extname(cleanRaw);
    if (!ext) {
      if (mimeType.includes('mp4')) ext = '.mp4';
      else if (mimeType.includes('webm')) ext = '.webm';
      else if (mimeType.includes('quicktime') || mimeType.includes('mov')) ext = '.mov';
      else if (mimeType.includes('png')) ext = '.png';
      else if (mimeType.includes('webp')) ext = '.webp';
      else if (mimeType.includes('svg')) ext = '.svg';
      else if (mimeType.includes('pdf')) ext = '.pdf';
      else ext = isVideo ? '.mp4' : '.jpg';
    }

    const baseName = path.basename(cleanRaw, ext);
    const uniqueFilename = `${baseName}_${Date.now()}${ext}`;

    const targetDir = path.join(process.cwd(), 'public', 'uploads', subFolder);
    await mkdir(targetDir, { recursive: true });

    const targetFilePath = path.join(targetDir, uniqueFilename);
    await writeFile(targetFilePath, fileBuffer);

    const publicUrl = `/uploads/${subFolder}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      originalName,
      folder: subFolder,
      size: fileBuffer.length,
      mimeType,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du fichier. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
