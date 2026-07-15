-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('ORGANIZATION', 'DECISION_BODY');

-- CreateTable
CREATE TABLE "Actor" (
    "id" SERIAL NOT NULL,
    "type" "ActorType" NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);
