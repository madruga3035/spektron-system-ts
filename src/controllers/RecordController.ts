import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class RecordController {
  async store(req: Request, res: Response) {
    const { description, value } = req.body;
    // Forçamos o userId a ser tratado como string
    const userId = (req as any).userId as string;

    const record = await prisma.dataRecord.create({
      data: { description, value, userId: userId }
    });
    return res.status(201).json(record);
  }

  //async index(req: Request, res: Response) {
  //  const records = await prisma.dataRecord.findMany({
  //    where: { userId: req.userId }
  //  });
  //  return res.json(records);
  //}
  async index(req: Request, res: Response) {
    
    const userRole = (req as any).userRole;
    const userId = (req as any).userId as string;

    try {
      let records;

      if (userRole === 'ADMIN') {
        // Admin vê TUDO, inclusive os marcados como excluídos
        records = await prisma.dataRecord.findMany();
      } else {
        // Usuário comum só vê o que NÃO tem data de exclusão
        records = await prisma.dataRecord.findMany({
          where: { 
            userId: userId,
            deletedAt: null 
          }
        });
      }

      return res.json(records);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar dados." });
    }
  }
  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    try {
      // 1. Verificamos se o registro existe antes de tentar deletar
      const record = await prisma.dataRecord.findUnique({ where: { id: id } });

      if (!record) {
        return res.status(404).json({ error: "Registro não encontrado." });
      }

      // 2. Executa a exclusão
      //await prisma.dataRecord.delete({ where: { id } });
      // Em vez de apagar, nós apenas carimbamos a data atual
      await prisma.dataRecord.update({
        where: { id: id },
        data: { deletedAt: new Date() }
      });

      return res.status(204).send(); // 204 significa "Sucesso, mas sem conteúdo para retornar"
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir o registro." });
    }
  }
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { description, value } = req.body;
    const userId = (req as any).userId as string;
    const userRole = (req as any).userRole;

    try {
      // 1. Busca o registro original
      const record = await prisma.dataRecord.findUnique({ where: { id: id as string } });

      if (!record) {
        return res.status(404).json({ error: "Registro não encontrado." });
      }

      // 2. Trava de Segurança: Só o DONO ou o ADMIN podem editar
      if (record.userId !== userId && userRole !== 'ADMIN') {
        return res.status(403).json({ error: "Acesso negado: Você não é o dono deste registro." });
      }

      // 3. Executa a atualização
      const updatedRecord = await prisma.dataRecord.update({
        where: { id: id as string },
        data: { 
          description, 
          value,
          // O Prisma só atualiza o que você enviar no body
        }
      });

      return res.json(updatedRecord);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar o registro." });
    }
  }
}
