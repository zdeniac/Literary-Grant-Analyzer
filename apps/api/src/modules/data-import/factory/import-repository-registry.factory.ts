import { prisma } from "../../../db/prisma";
import { ImportTargetRepository } from "../repository/import-target.repository";
import { ImportRepositoryRegistry } from "../registry/import-repository.registry";

export const createImportRepositoryRegistry = () =>
    new ImportRepositoryRegistry([
        ['journal', new ImportTargetRepository(prisma.journal)],
        ['organization', new ImportTargetRepository(prisma.organization)],
        ['awardScheme', new ImportTargetRepository(prisma.awardScheme)],
        ['decisionAuthority', new ImportTargetRepository(prisma.decisionAuthority)],
        ['awardDecision', new ImportTargetRepository(prisma.awardDecision)],
        ['sourceDocument', new ImportTargetRepository(prisma.sourceDocument)],
    ]);