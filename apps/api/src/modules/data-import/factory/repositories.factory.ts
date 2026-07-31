import { prisma } from "../../../db/prisma";
import { AwardSchemeModel } from "../../award-scheme/dto/award-scheme.dto";
import { DecisionBodyModel } from "../../decision-body/dto/decision-body.dto";
import { JournalModel } from "../../journal/dto/journal.dto";
import { OrganizationModel } from "../../organization/dto/organization.dto";
import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportTargetRepository } from "../repository/import-target.repository";
import { ImportRow } from "../types/import.types";
import { AwardDecisionModel } from "../../award-decision/types/award-decision.types";

export const createImportRepositories = () => ({
    journal: new ImportTargetRepository<JournalModel, ImportRow>(prisma.journal),

    organization: new ImportTargetRepository<OrganizationModel, ImportRow>(prisma.organization),

    awardScheme: new ImportTargetRepository<AwardSchemeModel, ImportRow>(prisma.awardScheme),

    decisionBody: new ImportTargetRepository<DecisionBodyModel, ImportRow>(prisma.decisionBody),

    awardDecision: new ImportTargetRepository<AwardDecisionModel, ImportRow>(prisma.awardDecision),
    
    importJob: new ImportJobRepository(prisma.importJob),
});