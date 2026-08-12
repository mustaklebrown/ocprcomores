import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: user || admin });
  } catch (error) {
    return NextResponse.json({ user: admin });
  }
}
