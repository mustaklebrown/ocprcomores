import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error: any) {
    console.error('Admin Documents GET Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des documents' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, description, fileUrl, fileName, fileSize, fileFormat, date, isPublished } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: 'Le titre et le fichier du document sont requis.' },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        category: category || 'Réglementation',
        description: description || '',
        fileUrl,
        fileName: fileName || title,
        fileSize: fileSize || '1.0 MB',
        fileFormat: fileFormat || 'PDF',
        date: date || new Date().getFullYear().toString(),
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'CREATE_DOCUMENT',
      details: `Création du document: "${document.title}" (${document.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, document }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Documents POST Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du document' },
      { status: 500 }
    );
  }
}
