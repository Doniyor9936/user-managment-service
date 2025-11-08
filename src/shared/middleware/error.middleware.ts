import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: 'internal server error' });
  }
}
