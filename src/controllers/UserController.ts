import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';

export class UserController {
  async store(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      // Verificar se o usuário já existe
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      // Removemos a senha do retorno por segurança
      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar usuário." });
    }
  }
}