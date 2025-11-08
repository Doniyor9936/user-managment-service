import bcrypt from 'bcryptjs';

const SALT_ROUND = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUND);
  }
  static async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
