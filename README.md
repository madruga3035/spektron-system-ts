# 🚀 Spektron System API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

O **Spektron System** é uma API robusta desenvolvida para gestão de serviços em segurança eletrônica (CFTV, alarmes, portões) e inspeção técnica veicular. O sistema foi projetado com foco em segurança, hierarquia de usuários e integridade de dados.

## 🛠️ Tecnologias Utilizadas

- **Runtime:** Node.js com `tsx` para execução TypeScript.
- **Linguagem:** TypeScript para tipagem estática e segurança de código.
- **Framework:** Express.js.
- **ORM:** Prisma para modelagem e persistência de dados.
- **Autenticação:** JWT (JSON Web Token) e Bcrypt para hashing de senhas.
- **Banco de Dados:** PostgreSQL (hospedado via Render/Neon).

## 🔐 Camadas de Segurança

A API implementa múltiplos níveis de proteção:
1. **Daily Token:** Proteção contra bots em rotas de registro público.
2. **JWT Authentication:** Validação de identidade para todas as rotas privadas.
3. **RBAC (Role-Based Access Control):** Controle de acesso baseado em cargos (`ADMIN`, `TECHNICIAN`, `USER`).
4. **Data Isolation:** Usuários comuns só podem visualizar e editar seus próprios registros.
5. **Soft Delete:** Dados removidos são apenas marcados, garantindo rastreabilidade e recuperação de desastres.

## 📌 Principais Endpoints

### Autenticação & Usuários
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Cadastro de novo usuário | Público (Daily Token) |
| `POST` | `/login` | Autenticação e geração de token | Público |
| `PUT` | `/users/:id` | Atualização de perfil/senha | Próprio Usuário ou Admin |
| `DELETE` | `/users/:id` | Desativação de conta (Soft Delete) | Somente Admin |

### Registros de Serviço (DataRecords)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/records` | Criar novo registro de serviço | Admin, Technician, User |
| `GET` | `/records` | Listar registros (com filtros de ID) | Todos Autenticados |
| `PUT` | `/records/:id` | Editar registro existente | Dono ou Admin |
| `DELETE` | `/records/:id` | Excluir registro (Soft Delete) | Somente Admin |

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/spektron-system-ts.git](https://github.com/seu-usuario/spektron-system-ts.git)

2. **Instale as dependências:**
npm install

3. **Configure as variáveis de ambiente (.env):**
DATABASE_URL="sua-url-do-postgres"
JWT_SECRET="sua-chave-secreta"
DAILY_TOKEN="seu-token-diario"

4. **Rode as migrações do banco:**
npx prisma db push

5. **Inicie o servidor:**
npm run dev

**Desenvolvido por Marcos como parte do ecossistema Spektron/Master Inspect.**
