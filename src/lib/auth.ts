import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Convert JWT_SECRET to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

// Password hashing - dynamic import to avoid Edge Runtime issues
export async function hashPassword(password: string): Promise<string> {
  // Use dynamic import to avoid Edge Runtime issues
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Use dynamic import to avoid Edge Runtime issues
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}

// JWT Token generation
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
}

// JWT Token verification
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
