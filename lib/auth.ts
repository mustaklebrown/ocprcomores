import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ocpr_comores_super_secure_jwt_secret_2026_key_change_in_prod'
);

export const COOKIE_NAME = 'ocpr_admin_token';
export const TOKEN_EXPIRY = '8h'; // 8 hours session

export interface AdminJwtPayload {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  iat?: number;
  exp?: number;
}

/**
 * Hash a plain text password with bcrypt (salt factor 12)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT token for Admin
 */
export async function signAdminToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as AdminJwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get current authenticated admin from request cookie
 */
export async function getAuthenticatedAdmin(req?: NextRequest): Promise<AdminJwtPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Helper to record security audit log entry in database
 */
export async function createAuditLog({
  adminId,
  adminEmail,
  action,
  details,
  ipAddress,
}: {
  adminId?: string;
  adminEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
}) {
  try {
    if (prisma && prisma.auditLog) {
      await prisma.auditLog.create({
        data: {
          adminId,
          adminEmail,
          action,
          details,
          ipAddress: ipAddress || 'unknown',
        },
      });
    }
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

/**
 * Extract client IP address from NextRequest
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
