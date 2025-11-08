import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { HttpError } from '../errors/http.error';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h';

export interface TokenPayload {
  sub: string;
  role: 'admin' | 'user';
}

export class JwtUtil {
  static sign(payload: TokenPayload): string {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as SignOptions);
    } catch (error) {
      console.error('JWT signing error:', error);
      throw new HttpError(500, 'Token signing failed');
    }
  }

  static verify(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      console.error('JWT verify error:', error);
      throw new HttpError(401, 'Invalid or expired token');
    }
  }
}
