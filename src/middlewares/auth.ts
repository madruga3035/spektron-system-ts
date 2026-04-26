import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token missing" });

  const [, token] = authHeader.split(' ');

  try {
  // Fazemos a verificação e forçamos o tipo como 'any' ou 'unknown' antes de definir o formato
  const decoded = jwt.verify(token!, SECRET_KEY) as unknown as { userId: string };
  
  // Agora o TS aceita que o userId existe
  req.userId = decoded.userId;

  return next();
} catch (err) {
  return res.status(401).json({ error: "Token inválido ou expirado." });
}
}