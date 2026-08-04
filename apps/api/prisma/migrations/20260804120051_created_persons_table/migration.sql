-- CreateEnum
CREATE TYPE "PersonRole" AS ENUM ('AUTHOR', 'CRITIC', 'EDITOR', 'TRANSLATOR', 'RESEARCHER', 'OTHER');

-- AlterEnum
ALTER TYPE "ActorType" ADD VALUE 'PERSON';

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "roles" "PersonRole"[],
    "actorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_actorId_key" ON "Person"("actorId");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
