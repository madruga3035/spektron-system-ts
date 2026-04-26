import type { Request, Response, NextFunction } from 'express';

export function checkRole(roles: string[]) {
  // Esta função de baixo é a que o Express realmente vai usar
  return (req: any, res: any, next: any) => {
    const userRole = req.userRole;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        error: "Acesso negado: permissão insuficiente." 
      });
    }

    next();
  };
}