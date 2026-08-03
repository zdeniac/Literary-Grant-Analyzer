/*
  Warnings:

  - The values [DECISION_BODY] on the enum `ActorType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `DecisionBody` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActorType_new" AS ENUM ('ORGANIZATION', 'DECISION_AUTHORITY');
ALTER TABLE "Actor" ALTER COLUMN "type" TYPE "ActorType_new" USING ("type"::text::"ActorType_new");
ALTER TYPE "ActorType" RENAME TO "ActorType_old";
ALTER TYPE "ActorType_new" RENAME TO "ActorType";
DROP TYPE "public"."ActorType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "DecisionBody" DROP CONSTRAINT "DecisionBody_actorId_fkey";

-- DropForeignKey
ALTER TABLE "DecisionBody" DROP CONSTRAINT "DecisionBody_organizationId_fkey";

-- DropTable
DROP TABLE "DecisionBody";

-- CreateTable
CREATE TABLE "DecisionAuthority" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DecisionAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DecisionAuthority_actorId_key" ON "DecisionAuthority"("actorId");

-- AddForeignKey
ALTER TABLE "DecisionAuthority" ADD CONSTRAINT "DecisionAuthority_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionAuthority" ADD CONSTRAINT "DecisionAuthority_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
