-- AlterEnum
ALTER TYPE "JournalStatus" ADD VALUE 'UNKNOWN';

-- AlterTable
ALTER TABLE "SourceDocument" ADD COLUMN  "issuingOrganizationId" INTEGER;

-- AddForeignKey
ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_issuingOrganizationId_fkey" FOREIGN KEY ("issuingOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
