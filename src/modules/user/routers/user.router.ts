import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { requireRole } from '../../../shared/middleware/role.middleware';
const router = Router();
const controller = new UserController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/', authMiddleware, requireRole(['admin']), controller.getAll);
router.patch('/:id/block', authMiddleware, requireRole(['admin']), controller.blockUser);
router.get('/me', authMiddleware, requireRole(['admin', 'user']), controller.getOne);

export default router;