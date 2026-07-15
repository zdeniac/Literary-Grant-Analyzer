import { prisma } from "../../../src/db/prisma";

export async function wipeDatabase() {
    await prisma.$transaction([
        prisma.awardScheme.deleteMany(),
        prisma.decisionBody.deleteMany(),
        prisma.journal.deleteMany(),
        prisma.organization.deleteMany(),
        prisma.actor.deleteMany(),
        prisma.sourceDocument.deleteMany(),
    ]);
}