import { Repository } from 'typeorm';
import { User } from '../entitys/user.entity';
import { AppDataSource } from '../../../config/data-source';
import { CreateUserDto } from '../dto/create.user.dto';
import { HttpError } from '../../../shared/errors/http.error';
import { LoginDto } from '../dto/login.user.dto';
import { PasswordUtil } from '../../../shared/utils/password.util';
import { JwtUtil } from '../../../shared/utils/jwt.util';

export class UserService {
  private readonly userRepo: Repository<User> = AppDataSource.getRepository(User);

  async register(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new HttpError(409, 'email already registred');
    }
    const hashPassword = await PasswordUtil.hash(dto.password);
    const user = this.userRepo.create({ ...dto, password: hashPassword });
    const saved = await this.userRepo.save(user);
    const { password, ...safeUser } = saved;
    return safeUser;
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new HttpError(401, 'invalid credentials');
    }
    const valid = PasswordUtil.compare(dto.password, user.password);
    if (!valid) {
      throw new HttpError(401, 'invalid credentials');
    }
    if (!user.isActive) {
      throw new HttpError(403, 'user is inactive');
    }
    const token = JwtUtil.sign({ sub: user.id, role: user.role });
    return { token };
  }

  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo.find();
    return users.map(({ password, ...rest }) => rest);
  }

  async getOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new HttpError(404, 'user not found');
    }
    const { password, ...rest } = user;
    return rest;
  }
  async blockUser(id: string, isActive: boolean): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new HttpError(404, 'not found');
    }
    user.isActive = isActive;
    await this.userRepo.save(user);
  }
}
