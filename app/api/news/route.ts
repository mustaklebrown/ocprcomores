import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ news });
  } catch (error: any) {
    return NextResponse.json({ news: [], error: 'Connexion base de données' });
  }
}
