-- CreateEnum
CREATE TYPE "AwardSchemeType" AS ENUM ('GRANT', 'SCHOLARSHIP', 'AWARD');

-- CreateTable
CREATE TABLE "AwardScheme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AwardSchemeType" NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AwardScheme_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AwardScheme" ADD CONSTRAINT "AwardScheme_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
