import { prisma } from "../../../src/db/prisma";

export async function wipeDatabase() {
    await prisma.$transaction([
        prisma.journalAffiliation.deleteMany(),
        prisma.journal.deleteMany(),
        prisma.awardDecision.deleteMany(),
        prisma.awardScheme.deleteMany(),
        prisma.decisionBody.deleteMany(),
        prisma.sourceDocument.deleteMany(),
        prisma.organization.deleteMany(),
        prisma.actor.deleteMany(),
    ]);
}