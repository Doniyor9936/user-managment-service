import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http.error';

export function requireRole(roles: Array<'admin' | 'user'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new HttpError(401, 'Unauthorized'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Forbidden: insufficient role'));
    }
    next();
  };
}
