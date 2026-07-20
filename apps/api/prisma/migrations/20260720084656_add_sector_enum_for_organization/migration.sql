/*
  Warnings:

  - Added the required column `sector` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sector" AS ENUM ('PUBLIC', 'CIVIL', 'MARKET', 'OTHER');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "sector" "Sector" NOT NULL;
