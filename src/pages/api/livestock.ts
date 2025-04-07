// pages/api/livestock.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { stock_type, counts } = req.body;
      
      const newLivestock = await prisma.liveStock.create({
        data: {
          stock_type,
          counts: parseInt(counts),
        },
      });
      
      res.status(201).json(newLivestock);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create livestock record' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}