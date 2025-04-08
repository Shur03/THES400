
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, password, phone } = req.body;

    if (!name || !password || !phone) {
      return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү." });
    }

    try {
      // Утасны дугаар давхцахгүй байх
      const existingHerder = await prisma.herder.findUnique({
        where: { phone },
      });

      if (existingHerder) {
        return res.status(400).json({ error: "Бүртгэлтэй дугаар байна." });
      }

      // амжилттай
      const newHerder = await prisma.herder.create({
        data: {
          name,
          password,
          phone,
        },
      });

      return res.status(201).json(newHerder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}