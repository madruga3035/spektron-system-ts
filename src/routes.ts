import { Router } from 'express';
import { SPEKTRON_BANNER } from './utils/banner.js';
import { UserController } from './controllers/UserController.js';
import { AuthController } from './controllers/AuthController.js';
import { RecordController } from './controllers/RecordController.js';
import { authMiddleware } from './middlewares/auth.js';
import { dailyTokenMiddleware } from './middlewares/dailyToken.js';
import { checkRole } from './middlewares/checkRole.js';
import { SetupController } from './controllers/SetupController.js';


const routes = Router();

const userController = new UserController();
const authController = new AuthController();
const recordController = new RecordController();
const setupController = new SetupController();

// --- Rota Raiz com Banner ---
routes.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(SPEKTRON_BANNER);
});

// --- Rotas Públicas ---
//routes.post('/register', dailyTokenMiddleware, userController.store);
routes.post('/setup', setupController.init);
routes.post('/login', authController.authenticate);

// --- Filtro de Autenticação Global ---
// A partir daqui, o req.userId e req.userRole são injetados automaticamente
//routes.use(authMiddleware);

// --- Rotas Privadas (Protegidas por Cargo) ---
// Somente ADMIN
routes.get('/admin/users', authMiddleware, checkRole(['ADMIN']), userController.index);
// Somente ADMIN pode criar outros usuários (ex: um admin criando um técnico)
routes.post('/admin/users', authMiddleware, checkRole(['ADMIN']), userController.createByAdmin);
// Edição de perfil (O controller garante que USER só edite a si mesmo)
routes.put('/users/:id', authMiddleware,userController.update);
// Deleção/Desativação (Somente ADMIN)
routes.delete('/users/:id', authMiddleware, checkRole(['ADMIN']), userController.delete);

// ADMIN e TECHNICIAN
routes.post('/records', authMiddleware, checkRole(['ADMIN', 'TECHNICIAN' , 'USER']), recordController.store);
routes.get('/records', authMiddleware, checkRole(['ADMIN', 'TECHNICIAN', 'USER']), recordController.index);
// Somente ADMIN pode deletar registros
routes.delete('/records/:id', authMiddleware, checkRole(['ADMIN']), recordController.delete);
// ADMIN e USER podem editar (a lógica dentro do controller filtra quem é o dono)
routes.put('/records/:id', authMiddleware, checkRole(['ADMIN', 'TECHNICIAN', 'USER']), recordController.update);

routes.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada. Verifique o endereço e o método (GET/POST)." });
});

export { routes };