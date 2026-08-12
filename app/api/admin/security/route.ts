import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, verifyPassword, hashPassword, createAuditLog, getClientIp } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mot de passe actuel et nouveau mot de passe requis.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: admin.id } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé en base.' }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Le mot de passe actuel est incorrect.' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'CHANGE_PASSWORD',
      details: 'Modification réussie du mot de passe administrateur.',
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
