import { prisma } from "../../../src/db/prisma";

export async function wipeDatabase() {
    await prisma.$transaction([
        prisma.decisionBody.deleteMany(),
        prisma.journal.deleteMany(),
        prisma.organization.deleteMany(),
    ]);
}