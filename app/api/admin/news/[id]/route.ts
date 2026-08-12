import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const article = await prisma.news.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
    return NextResponse.json({ article });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        slug: body.slug ?? existing.slug,
        category: body.category ?? existing.category,
        excerpt: body.excerpt ?? existing.excerpt,
        content: body.content ?? existing.content,
        date: body.date ?? existing.date,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
        readTime: body.readTime ?? existing.readTime,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'UPDATE_NEWS',
      details: `Mise à jour de l article: "${updated.title}" (${updated.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await context.params;
    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });

    await prisma.news.delete({ where: { id } });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'DELETE_NEWS',
      details: `Suppression de l article: "${existing.title}" (${existing.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: 'Article supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
