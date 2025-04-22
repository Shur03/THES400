-- CreateEnum
CREATE TYPE "FodderType" AS ENUM ('uvs', 'tejeel');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('M', 'F', 'Father');

-- CreateEnum
CREATE TYPE "StockType" AS ENUM ('sheep', 'goat', 'horse', 'camel', 'cattle');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('dec', 'inc');

-- CreateTable
CREATE TABLE "Herder" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Herder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FodderStock" (
    "id" SERIAL NOT NULL,
    "types" "FodderType" NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FodderStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FodderRecord" (
    "id" SERIAL NOT NULL,
    "fodder_id" INTEGER NOT NULL,
    "quantity_used" INTEGER NOT NULL,
    "used_date" TIMESTAMP(3),

    CONSTRAINT "FodderRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FodderPurchase" (
    "id" SERIAL NOT NULL,
    "fodder_id" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "counts" INTEGER,
    "price" INTEGER,
    "buy_date" TIMESTAMP(3),

    CONSTRAINT "FodderPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveStock" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "stock_type" "StockType" NOT NULL,
    "counts" INTEGER NOT NULL,

    CONSTRAINT "LiveStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRecord" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "event_type" "EventType" NOT NULL,
    "counts" INTEGER NOT NULL,
    "descrip" VARCHAR(100),
    "event_date" TIMESTAMP(3),

    CONSTRAINT "EventRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "treatment_name" TEXT NOT NULL,
    "descrip" VARCHAR(100),
    "freq_date" TIMESTAMP(3),

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sire" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "name" TEXT,
    "breed" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" INTEGER,
    "year" INTEGER,

    CONSTRAINT "Sire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Herder_phone_key" ON "Herder"("phone");

-- AddForeignKey
ALTER TABLE "FodderStock" ADD CONSTRAINT "FodderStock_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Herder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FodderRecord" ADD CONSTRAINT "FodderRecord_fodder_id_fkey" FOREIGN KEY ("fodder_id") REFERENCES "FodderStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FodderPurchase" ADD CONSTRAINT "FodderPurchase_fodder_id_fkey" FOREIGN KEY ("fodder_id") REFERENCES "FodderStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStock" ADD CONSTRAINT "LiveStock_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Herder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRecord" ADD CONSTRAINT "EventRecord_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "LiveStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "LiveStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sire" ADD CONSTRAINT "Sire_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "LiveStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Herder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
