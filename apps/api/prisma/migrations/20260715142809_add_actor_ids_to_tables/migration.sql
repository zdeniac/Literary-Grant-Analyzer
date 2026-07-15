/*
  Warnings:

  - A unique constraint covering the columns `[actorId]` on the table `DecisionBody` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[actorId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actorId` to the `DecisionBody` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actorId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DecisionBody" ADD COLUMN     "actorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "actorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DecisionBody_actorId_key" ON "DecisionBody"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_actorId_key" ON "Organization"("actorId");

-- AddForeignKey
ALTER TABLE "DecisionBody" ADD CONSTRAINT "DecisionBody_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
