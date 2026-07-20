/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Journal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_organizationId_fkey";

-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "organizationId";

-- CreateTable
CREATE TABLE "JournalOrganization" (
    "id" SERIAL NOT NULL,
    "journalId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "fromYear" INTEGER,
    "toYear" INTEGER,

    CONSTRAINT "JournalOrganization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalOrganization" ADD CONSTRAINT "JournalOrganization_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalOrganization" ADD CONSTRAINT "JournalOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
