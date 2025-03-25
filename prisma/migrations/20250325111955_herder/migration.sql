/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FodderStock" DROP CONSTRAINT "FodderStock_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "LiveStock" DROP CONSTRAINT "LiveStock_owner_id_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Herder" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Herder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Herder_phone_key" ON "Herder"("phone");

-- AddForeignKey
ALTER TABLE "FodderStock" ADD CONSTRAINT "FodderStock_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Herder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStock" ADD CONSTRAINT "LiveStock_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Herder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
