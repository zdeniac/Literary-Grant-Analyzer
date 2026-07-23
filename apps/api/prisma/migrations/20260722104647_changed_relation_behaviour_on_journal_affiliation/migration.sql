-- DropForeignKey
ALTER TABLE "JournalAffiliation" DROP CONSTRAINT "JournalAffiliation_journalId_fkey";

-- DropForeignKey
ALTER TABLE "JournalAffiliation" DROP CONSTRAINT "JournalAffiliation_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "JournalAffiliation" ADD CONSTRAINT "JournalAffiliation_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAffiliation" ADD CONSTRAINT "JournalAffiliation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
