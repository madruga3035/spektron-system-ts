import express from 'express';
import { routes } from './routes.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes); // Aqui ele carrega todas as rotas que definimos

app.listen(PORT, () => {
  console.log(`🚀 Spektron System V8 rodando forte na porta ${PORT} ...`);
});