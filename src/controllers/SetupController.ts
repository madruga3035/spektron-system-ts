import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';

export class SetupController {
  async init(req: Request, res: Response) {
    const { activationKey, adminName, adminEmail, adminPassword } = req.body;

    try {
      // 1. Verifica se já existe um Admin ou se o setup já foi feito
      const config = await prisma.systemConfig.findFirst();
      if (config?.setupDone) {
        return res.status(403).json({ error: "O sistema já foi configurado e ativado." });
      }

      // 2. Valida a Chave de Ativação (que você define no .env)
      if (activationKey !== process.env.MASTER_ACTIVATION_KEY) {
        return res.status(401).json({ error: "Chave de ativação inválida." });
      }

      // 3. Cria o Super Usuário (ADMIN)
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });

      // 4. Marca o sistema como ativado
      await prisma.systemConfig.create({
        data: { setupDone: true, activationKey }
      });

      return res.status(201).json({ message: "Sistema Spektron ativado com sucesso! Admin criado." });

    } catch (error) {
      return res.status(500).json({ error: "Erro durante a ativação do sistema." });
    }
  }
}