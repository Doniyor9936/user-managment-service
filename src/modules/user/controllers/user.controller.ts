import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { HttpError } from '../../../shared/errors/http.error';

export class UserController {
  private readonly userService = new UserService();

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new HttpError(400, 'Email and password are required');
      }
      const token = await this.userService.login({ email, password });
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  };
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
  getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getOne(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
  blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      if (typeof isActive !== 'boolean') {
        throw new HttpError(400, 'isActive must be boolean');
      }
      await this.userService.blockUser(id, isActive);
      res.status(200).json({ message: 'user update succesfully' });
    } catch (error) {
      next(error);
    }
  };
}
