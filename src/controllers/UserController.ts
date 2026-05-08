import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';

export class UserController {
  async index(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
      
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar usuários." });
    }
  }

  async createByAdmin(req: Request, res: Response) {
    const { name, email, password, role } = req.body;

    try {
      // Como o middleware 'checkRole' já validou que quem chama é ADMIN,
      // apenas executamos a criação sem precisar de tokens diários.
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'USER' // O Admin define o cargo do novo funcionário
        }
      });

      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      return res.status(400).json({ error: "E-mail já cadastrado ou dados inválidos." });
    }
  }
  async store(req: Request, res: Response) {
    const { name, email, password, role } = req.body;

    try {
      // Verificar se o usuário já existe
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: role || 'USER' }
      });

      // Removemos a senha do retorno por segurança
      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar usuário." });
    }
  }
  async update(req: Request, res: Response) {
    const id = req.params.id as string;  // ID do usuário a ser editado
    const { name, email, password, role } = req.body;
    const loggedUserId = (req as any).userId as string;
    const loggedUserRole = (req as any).userRole;

    try {
    // 1. Verificação de permissão (Dono ou Admin)
      if (loggedUserRole !== 'ADMIN' && loggedUserId !== id) {
        return res.status(403).json({ error: "Acesso negado: você só pode editar seu próprio perfil." });
      }

      // 2. Montamos o objeto de atualização apenas com o que foi enviado
      // Isso evita que campos não enviados sejam sobrescritos com null ou undefined
      const updateData: any = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role && loggedUserRole === 'ADMIN') updateData.role = role; // Só Admin muda cargo

      // 3. Tratamento especial para a senha
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // 4. Executa o update no Prisma
      const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data: updateData
      });

      // 5. Retorno seguro (sem a senha)
      const { password: _, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);

    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar usuário. Verifique se o e-mail já existe." });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    try {
      // Apenas marcamos como excluído para não quebrar o histórico de registros (Soft Delete)
      await prisma.user.update({
        where: { id },
        data: { 
          deletedAt: new Date(),
          // Se você não tiver 'deletedAt' na tabela User, use um campo 'active: false'
          // Ou adicione o campo 'deletedAt' no seu schema.prisma para usuários também
          role: 'INACTIVE' // Uma alternativa simples se não quiser mexer no schema agora
        }
      });

      return res.status(204).send();
    } catch (error: any) {
        // Se o Prisma não achar o ID, ele lança o código P2025
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        return res.status(500).json({ error: "Erro ao desativar usuário." });
    }
  }
}