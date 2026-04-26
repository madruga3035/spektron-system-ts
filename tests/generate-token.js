import { createHash } from 'crypto'; // Nativo do Node.js, não precisa instalar nada

const MY_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_aleatoria_aqui_123"; // esta chave devera ser a mesma usada no .env do projeto principal
const today = new Date().toISOString().split('T')[0];
const seed = `${today}-${MY_SECRET}`;

const hash = createHash('sha256').update(seed).digest('hex');
const dailyToken = hash.substring(0, 8).toUpperCase();

console.log("-----------------------------------------");
console.log(`Token do dia (${today}): ${dailyToken}`);
console.log("-----------------------------------------");