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
}