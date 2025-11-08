import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';
import jwt, { JwtPayload } from 'jsonwebtoken';
export interface AuthUser {
  id: string;
  role: 'admin' | 'user';
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'missing or invalid Authorization header'));
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      sub: string;
      role: 'admin' | 'user';
    };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    next(new HttpError(401, 'invalid or expired token'));
  }
}
