import { Router } from 'express';
import { SPEKTRON_BANNER } from './utils/banner.js';
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

// --- Rota Raiz com Banner ---
routes.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(SPEKTRON_BANNER);
});

// --- Rotas Públicas ---
routes.post('/register', dailyTokenMiddleware, userController.store);
routes.post('/login', authController.authenticate);

// --- Filtro de Autenticação Global ---
// A partir daqui, o req.userId e req.userRole são injetados automaticamente
routes.use(authMiddleware);

// --- Rotas Privadas (Protegidas por Cargo) ---

// Somente ADMIN
routes.get('/admin/users', checkRole(['ADMIN']), userController.index);
// Somente ADMIN pode criar outros usuários (ex: um admin criando um técnico)
routes.post('/admin/users', checkRole(['ADMIN']), userController.createByAdmin);
// Edição de perfil (O controller garante que USER só edite a si mesmo)
routes.put('/users/:id', userController.update);
// Deleção/Desativação (Somente ADMIN)
routes.delete('/users/:id', checkRole(['ADMIN']), userController.delete);

// ADMIN e TECHNICIAN
routes.post('/records', checkRole(['ADMIN', 'TECHNICIAN' , 'USER']), recordController.store);
routes.get('/records', checkRole(['ADMIN', 'TECHNICIAN', 'USER']), recordController.index);
// Somente ADMIN pode deletar registros
routes.delete('/records/:id', checkRole(['ADMIN']), recordController.delete);
// ADMIN e USER podem editar (a lógica dentro do controller filtra quem é o dono)
routes.put('/records/:id', checkRole(['ADMIN', 'TECHNICIAN', 'USER']), recordController.update);

export { routes };