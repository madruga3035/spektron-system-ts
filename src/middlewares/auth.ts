import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const SECRET_KEY = process.env.JWT_SECRET!;

interface TokenPayload {
  userId: string;
  role: string;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token missing" });

  const [, token] = authHeader.split(' ');

  try {
  // Fazemos a verificação e forçamos o tipo como 'any' ou 'unknown' antes de definir o formato
  const decoded = jwt.verify(token!, SECRET_KEY) as unknown as TokenPayload;
  
  const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, role: true, deletedAt: true } });

  if (!user || user.deletedAt !== null || user.role === 'INACTIVE') {
    return res.status(403).json({ error: "Usuário inativo ou não encontrado." });
  }
  
  (req as any).userId = decoded.userId;
  (req as any).userRole = decoded.role;

  return next();
} catch (err) {
  return res.status(401).json({ error: "Token inválido ou expirado." });
}
}