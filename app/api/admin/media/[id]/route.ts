import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: 'Média non trouvé' }, { status: 404 });

    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await context.params;
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Média non trouvé' }, { status: 404 });

    const body = await req.json();
    const { title, category, type, url, description, isPublished } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Le titre et l’URL du média sont obligatoires.' }, { status: 400 });
    }

    const updated = await prisma.media.update({
      where: { id },
      data: {
        title,
        category: category || 'Général',
        type: type === 'VIDEO' ? 'VIDEO' : 'PHOTO',
        url,
        description: description || '',
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'UPDATE_MEDIA',
      details: `Modification du média: "${updated.title}" (${updated.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, media: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await context.params;
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Média non trouvé' }, { status: 404 });

    await prisma.media.delete({ where: { id } });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'DELETE_MEDIA',
      details: `Suppression du média: "${existing.title}" (${existing.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: 'Média supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

