import { prisma } from "../../../src/db/prisma";

export async function wipeDatabase() {
    await prisma.$transaction([
        prisma.journal.deleteMany(),
        prisma.organization.deleteMany(),
    ]);
}