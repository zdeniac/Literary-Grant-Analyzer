-- CreateTable
CREATE TABLE "DecisionBody" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DecisionBody_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DecisionBody" ADD CONSTRAINT "DecisionBody_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
