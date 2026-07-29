/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ImportJob` table. All the data in the column will be lost.
  - You are about to drop the column `sourceDocumentId` on the `ImportJob` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImportJob" DROP CONSTRAINT "ImportJob_sourceDocumentId_fkey";

-- AlterTable
ALTER TABLE "ImportJob" DROP COLUMN "createdAt",
DROP COLUMN "sourceDocumentId";

-- CreateTable
CREATE TABLE "ImportJobSourceDocument" (
    "importJobId" INTEGER NOT NULL,
    "sourceDocumentId" INTEGER NOT NULL,

    CONSTRAINT "ImportJobSourceDocument_pkey" PRIMARY KEY ("importJobId","sourceDocumentId")
);

-- AddForeignKey
ALTER TABLE "ImportJobSourceDocument" ADD CONSTRAINT "ImportJobSourceDocument_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJobSourceDocument" ADD CONSTRAINT "ImportJobSourceDocument_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
