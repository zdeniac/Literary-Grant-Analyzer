-- CreateTable
CREATE TABLE "AwardDecision" (
    "id" SERIAL NOT NULL,
    "awardSchemeId" INTEGER NOT NULL,
    "decisionMakerId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "sourceDocumentId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30),
    "purpose" TEXT,
    "sourceIdentifier" TEXT,
    "decisionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AwardDecision_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AwardDecision" ADD CONSTRAINT "AwardDecision_awardSchemeId_fkey" FOREIGN KEY ("awardSchemeId") REFERENCES "AwardScheme"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "AwardDecision" ADD CONSTRAINT "AwardDecision_decisionMakerId_fkey" FOREIGN KEY ("decisionMakerId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "AwardDecision" ADD CONSTRAINT "AwardDecision_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "AwardDecision" ADD CONSTRAINT "AwardDecision_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
