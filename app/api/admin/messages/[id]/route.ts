import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 });

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: status || 'READ' },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'UPDATE_MESSAGE_STATUS',
      details: `Statut du message (${updated.id}) modifié à: ${updated.status}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await context.params;
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 });

    await prisma.contactMessage.delete({ where: { id } });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'DELETE_MESSAGE',
      details: `Suppression du message de ${existing.name} (${existing.email})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: 'Message supprimé' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
