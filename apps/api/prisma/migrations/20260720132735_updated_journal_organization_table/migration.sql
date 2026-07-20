-- DropIndex
DROP INDEX "JournalOrganization_journalId_organizationId_fromYear_key";

-- AlterTable
ALTER TABLE "JournalOrganization" ALTER COLUMN "fromYear" DROP NOT NULL;
