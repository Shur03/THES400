/*
  Warnings:

  - You are about to drop the column `owner_id` on the `LiveStock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LiveStock" DROP COLUMN "owner_id";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
