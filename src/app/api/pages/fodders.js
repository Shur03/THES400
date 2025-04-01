import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const fodders = await prisma.fodder.findMany();
      res.json(fodders);
    } catch (error) {
      console.error("Error fetching fodder data:", error);
      res.status(500).json({ error: "Error fetching fodder data" });
    }
    
  }
}
