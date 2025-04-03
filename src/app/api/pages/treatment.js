// pages/api/treatments.ts
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get the authenticated user's session
      const session = await getSession({ req });
      
      if (!session?.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = session.user.id;

      // First find all livestock belonging to this user
      const userLivestock = await prisma.liveStock.findMany({
        where: {
          owner_id: userId
        },
        select: {
          id: true // We only need the IDs for the next query
        }
      });

      // Extract just the livestock IDs
      const livestockIds = userLivestock.map(animal => animal.id);

      // Then find medical records for these livestock
      const medicalRecords = await prisma.medicalRecord.findMany({
        where: {
          stock_id: {
            in: livestockIds
          }
        },
        include: {
          stock: true // Include the related livestock data if needed
        }
      });

      res.json(medicalRecords);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ error: "Error fetching medical records" });
    }
  }
}