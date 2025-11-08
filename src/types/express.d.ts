import 'express'; // Express moduli bilan merge qilish uchun

export interface AuthUser {
  id: string;
  role: 'admin' | 'user';
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}
