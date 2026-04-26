import { Router } from 'express';
import { UserController } from './controllers/UserController.js';
import { AuthController } from './controllers/AuthController.js';
import { RecordController } from './controllers/RecordController.js';
import { authMiddleware } from './middlewares/auth.js';

const routes = Router();

const userController = new UserController();
const authController = new AuthController();
const recordController = new RecordController();

// Rotas Públicas (Abertas)
routes.post('/register', userController.store);
routes.post('/login', authController.authenticate);

// Rotas Privadas (Tudo abaixo do middleware precisa de Token)
routes.use(authMiddleware);

routes.post('/records', recordController.store);
routes.get('/records', recordController.index);

export { routes };