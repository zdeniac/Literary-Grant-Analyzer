-- CreateEnum
CREATE TYPE "LegalForm" AS ENUM ('LTD', 'PLC', 'FOUNDATION', 'ASSOCIATION', 'OTHER');

-- AlterTable
ALTER TABLE "Organization"
ADD COLUMN     "address" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "foundingDate" TIMESTAMP(3),
ADD COLUMN     "legalForm" "LegalForm" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
