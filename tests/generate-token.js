import { createHash } from 'crypto'; //Codigo demostrativo, com passo a passo para gerar o token diário. 
//Ele deve ser executado separadamente, e o token gerado deve ser usado na requisição de registro de usuário (POST /register) do sistema principal.

const MY_SECRET = process.env.JWT_SECRET || "Ayrton_Senna_"; // esta chave devera ser a mesma usada no .env do projeto principal
console.log(MY_SECRET);
const today = new Date().toISOString().split('T')[0];
console.log(today);
const seed = `${today}-${MY_SECRET}`;
console.log(seed);

const hash = createHash('sha256').update(seed).digest('hex');
console.log(hash);
const dailyToken = hash.substring(0, 8).toUpperCase();
console.log(dailyToken);

console.log("-----------------------------------------");
console.log(`Token do dia (${today}): ${dailyToken}`);
console.log("-----------------------------------------");