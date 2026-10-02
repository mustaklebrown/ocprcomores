import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, signAdminToken, COOKIE_NAME, getClientIp, createAuditLog } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Rate Limiting Check (5 login attempts per IP every 15 minutes)
    const rateCheck = rateLimit({ identifier: `login_${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Trop de tentatives de connexion failed. Veuillez réinstaller votre calme et réessayer dans 15 minutes.' },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Veuillez saisir votre adresse e-mail et votre mot de passe.' },
        { status: 400 }
      );
    }

    const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@ocprcomores.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@OCPR2026!';
    const isDevelopment = process.env.NODE_ENV !== 'production';

    let user = null;
    let isValidPassword = false;

    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (user) {
        isValidPassword = await verifyPassword(password, user.passwordHash);
      }
    } catch (dbErr) {
      console.warn('Prisma DB lookup fallback mode:', dbErr);
    }

    // Allow default credentials fallback ONLY in strict local development mode
    // NODE_ENV must be exactly 'development' — staging/preview are excluded
    const isStrictDev = process.env.NODE_ENV === 'development';
    if (!user && isStrictDev && email.toLowerCase().trim() === adminEmail && password === adminPassword) {
      console.warn(
        `⚠️ [Sécurité] Connexion via identifiants de secours dev depuis IP: ${ip}. Ne jamais utiliser en production.`
      );
      user = {
        id: 'seed-superadmin-id',
        email: adminEmail,
        name: process.env.ADMIN_DEFAULT_NAME || 'Direction OCPR Comores',
        role: 'SUPER_ADMIN' as const,
        passwordHash: '',
      };
      isValidPassword = true;
    }

    if (!user || !isValidPassword) {
      // Audit log failed login
      await createAuditLog({
        adminEmail: email,
        action: 'LOGIN_FAILED',
        details: 'Tentative de connexion avec des identifiants invalides.',
        ipAddress: ip,
      });

      return NextResponse.json(
        { error: 'Adresse e-mail ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    // Update last login timestamp if user exists in DB
    try {
      if (user.id !== 'seed-superadmin-id') {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }
    } catch (e) {
      // ignore non-critical update failure
    }

    // 2. Sign JWT Token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = await signAdminToken(tokenPayload);

    // 3. Record Audit Log
    await createAuditLog({
      adminId: user.id,
      adminEmail: user.email,
      action: 'LOGIN_SUCCESS',
      details: 'Connexion réussie à l espace d administration.',
      ipAddress: ip,
    });

    // 4. Create HTTP-Only Cookie Response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours in seconds
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login Route Error:', error);
    return NextResponse.json(
      { error: 'Une erreur serveur est survenue lors de la connexion.' },
      { status: 500 }
    );
  }
}
