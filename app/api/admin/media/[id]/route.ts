import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

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
