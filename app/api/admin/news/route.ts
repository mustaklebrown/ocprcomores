import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ news });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, category, excerpt, content, date, imageUrl, readTime, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Le titre et le contenu de l article sont obligatoires.' }, { status: 400 });
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + `-${Date.now()}`;

    const newArticle = await prisma.news.create({
      data: {
        title,
        slug: generatedSlug,
        category: category || 'Institutionnel',
        excerpt: excerpt || title,
        content,
        date: date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        imageUrl: imageUrl || null,
        readTime: readTime || '3 min',
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'CREATE_NEWS',
      details: `Publication de l article: "${newArticle.title}" (${newArticle.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
