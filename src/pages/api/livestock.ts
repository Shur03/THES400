import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Get the current session - await this call!
      const session = await getServerSession(req, res, authOptions);
      
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' });
      }

      const { stock_type, counts } = req.body;
      
      // Create new livestock with the logged-in herder's ID
      const newLivestock = await prisma.liveStock.create({
        data: {
          stock_type,
          counts: parseInt(counts),
          owner_id: parseInt(session.user.id), // Use ownerId to match your schema
        },
      });
      
      return res.status(201).json(newLivestock);
    } catch (error) {
      console.error('Малын бүртгэл үүсгэхэд алдаа гарлаа:', error);
      return res.status(500).json({ error: 'Малын бүртгэл үүсгэхэд алдаа гарлаа' });
    }
  } else if (req.method === 'GET') {
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' });
      }

      const livestock = await prisma.liveStock.findMany({
        where: {
          owner_id: parseInt(session.user.id)
        }
      });
      
      return res.status(200).json(livestock);
    } catch (error) {
      console.error('Малын бүртгэл авахад алдаа гарлаа:', error);
      return res.status(500).json({ error: 'Малын бүртгэл авахад алдаа гарлаа' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}