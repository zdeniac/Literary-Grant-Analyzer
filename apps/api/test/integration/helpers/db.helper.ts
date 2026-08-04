import { prisma } from "../../../src/db/prisma";

export async function wipeDatabase() {
    await prisma.$transaction([
        prisma.person.deleteMany(),
        prisma.importJobSourceDocument.deleteMany(),
        prisma.importJob.deleteMany(),
        prisma.journalAffiliation.deleteMany(),
        prisma.journal.deleteMany(),
        prisma.awardDecision.deleteMany(),
        prisma.awardScheme.deleteMany(),
        prisma.decisionAuthority.deleteMany(),
        prisma.sourceDocument.deleteMany(),
        prisma.organization.deleteMany(),
        prisma.actor.deleteMany(),
    ]);
}