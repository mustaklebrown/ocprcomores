import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ media: [], error: 'Connexion base de données' });
  }
}
