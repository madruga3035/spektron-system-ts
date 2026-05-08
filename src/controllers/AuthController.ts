import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

export class AuthController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }
    if (user.role === 'INACTIVE' || user.deletedAt !== null) {
      return res.status(403).json({ error: "Usuário inativo. Contate o administrador." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  }
}