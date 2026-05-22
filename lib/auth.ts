import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: object, expiresIn: string | number = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
