import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
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

      if (!targetUrl || !targetUrl.startsWith('http')) {
        return NextResponse.json(
          { error: "Veuillez fournir une URL d'image ou de document valide (commençant par http:// ou https://)." },
          { status: 400 }
        );
      }

      const response = await fetch(targetUrl);
      if (!response.ok) {
        return NextResponse.json(
          { error: `Impossible de récupérer l'image depuis l'URL fournie (Statut HTTP ${response.status}).` },
          { status: 400 }
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      mimeType = response.headers.get('content-type') || 'image/jpeg';
      
      const parsedPath = new URL(targetUrl).pathname;
      originalName = path.basename(parsedPath) || `remote_${Date.now()}`;
    } else {
      // Multipart form data mode
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const urlInput = formData.get('url') as string | null;
      requestedFolder = (formData.get('folder') as string) || 'images';

      if (urlInput && urlInput.startsWith('http')) {
        const response = await fetch(urlInput);
        if (!response.ok) {
          return NextResponse.json(
            { error: `Impossible de télécharger l'image depuis l'URL (Statut HTTP ${response.status}).` },
            { status: 400 }
          );
        }
        const arrayBuffer = await response.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
        mimeType = response.headers.get('content-type') || 'image/jpeg';
        const parsedPath = new URL(urlInput).pathname;
        originalName = path.basename(parsedPath) || `remote_${Date.now()}`;
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
      return NextResponse.json(
        { error: 'Le fichier reçu est vide.' },
        { status: 400 }
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
      { error: `Erreur lors du traitement de l'image ou du document : ${error.message}` },
      { status: 500 }
    );
  }
}
