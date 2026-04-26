import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class RecordController {
  async store(req: Request, res: Response) {
    const { description, value } = req.body;
    const record = await prisma.dataRecord.create({
      data: { description, value, userId: req.userId }
    });
    return res.status(201).json(record);
  }

  async index(req: Request, res: Response) {
    const records = await prisma.dataRecord.findMany({
      where: { userId: req.userId }
    });
    return res.json(records);
  }
}