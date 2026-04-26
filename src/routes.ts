import { Router } from 'express';
import { UserController } from './controllers/UserController.js';
import { AuthController } from './controllers/AuthController.js';
import { RecordController } from './controllers/RecordController.js';
import { authMiddleware } from './middlewares/auth.js';
import { dailyTokenMiddleware } from './middlewares/dailyToken.js';
import { checkRole } from './middlewares/checkRole.js';

const routes = Router();

const userController = new UserController();
const authController = new AuthController();
const recordController = new RecordController();

// --- Rotas Públicas ---
routes.post('/register', dailyTokenMiddleware, userController.store);
routes.post('/login', authController.authenticate);

// --- Filtro de Autenticação Global ---
// A partir daqui, o req.userId e req.userRole são injetados automaticamente
routes.use(authMiddleware);

// --- Rotas Privadas (Protegidas por Cargo) ---

// Somente ADMIN
routes.get('/admin/users', checkRole(['ADMIN']), userController.index);

// ADMIN e TECHNICIAN
routes.post('/records', checkRole(['ADMIN', 'TECHNICIAN']), recordController.store);
routes.get('/records', checkRole(['ADMIN', 'TECHNICIAN']), recordController.index);

export { routes };