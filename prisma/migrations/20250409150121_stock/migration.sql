/*
  Warnings:

  - You are about to drop the column `ownerId` on the `LiveStock` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `LiveStock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LiveStock" DROP CONSTRAINT "LiveStock_ownerId_fkey";

-- AlterTable
ALTER TABLE "LiveStock" DROP COLUMN "ownerId",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LiveStock" ADD CONSTRAINT "LiveStock_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Herder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
