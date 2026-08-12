import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const body = await req.json();
    const { title, category, type, url, description, isPublished } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Le titre et l URL du média sont obligatoires.' }, { status: 400 });
    }

    const newMedia = await prisma.media.create({
      data: {
        title,
        category: category || 'Général',
        type: type === 'VIDEO' ? 'VIDEO' : 'PHOTO',
        url,
        description: description || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'CREATE_MEDIA',
      details: `Ajout au média library: "${newMedia.title}" (${newMedia.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, media: newMedia }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
