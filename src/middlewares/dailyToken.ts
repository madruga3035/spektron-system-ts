import type { Request, Response, NextFunction } from 'express';
import { generateDailyToken } from '../lib/security.js';

export function dailyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const clientToken = req.headers['x-daily-token'];

    if (!clientToken || clientToken !== generateDailyToken()) {
        return res.status(403).json({ error: "Acesso não autorizado. Token diário inválido." });
    }

    next();
}