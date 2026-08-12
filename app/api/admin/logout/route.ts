import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    const ip = getClientIp(req);

    if (admin) {
      await createAuditLog({
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'LOGOUT',
        details: 'Déconnexion manuelle de l espace d administration.',
        ipAddress: ip,
      });
    }

    const response = NextResponse.json({ success: true, message: 'Déconnexion réussie' });
    response.cookies.delete(COOKIE_NAME);
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}
