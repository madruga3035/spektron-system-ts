🛡️ Como gerar o Token de Acesso Diário
Para realizar requisições na API, usamos um token dinâmico baseado em uma chave secreta.

No seu cliente de API (Apidog/Postman), crie uma variável de ambiente chamada MY_SECRET.

Cole o valor da chave secreta (solicite ao administrador).

Use o script abaixo na aba Pre-request da sua coleção ou pasta:

JavaScript

// Apidog já possui a biblioteca CryptoJS embutida
const crypto = require('crypto-js');

// 1. Defina a mesma SECRET_KEY que está no seu .env
const MY_SECRET = "sua_chave_secreta_super_aleatoria_aqui_123"; 

// 2. Obtém a data atual (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];

// 3. Gera o hash
const seed = `${today}-${MY_SECRET}`;
const hash = crypto.SHA256(seed).toString(crypto.enc.Hex);

// 4. Pega os 8 primeiros caracteres
const dailyToken = hash.substring(0, 8).toUpperCase();

// 5. Salva em uma variável temporária do Apidog
pm.variables.set("daily_token_variable", dailyToken);

console.log("Token gerado para hoje: " + dailyToken);