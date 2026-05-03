FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# 1. Copia apenas os arquivos de dependências primeiro
COPY package*.json ./

# 2. Instala as dependências, mas IGNORA os scripts de postinstall temporariamente
# Isso evita que o Prisma tente gerar o cliente sem o arquivo schema
RUN npm install --ignore-scripts

# 3. AGORA copia o restante do código (incluindo a pasta prisma/)
COPY . .

# 4. Agora que o arquivo existe, rodamos o generate manualmente
RUN npx prisma generate

# 5. Build do TypeScript (se você estiver usando)
RUN npm run build --if-present

RUN npm install -g ts-node typescript

RUN npm install tsx

EXPOSE 3000

CMD ["npm", "start"]