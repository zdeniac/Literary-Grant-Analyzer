import { prisma } from "../../../db/prisma";
import { AwardSchemeModel } from "../../award-scheme/dto/award-scheme.dto";
import { DecisionAuthorityEntity } from "../../decision-authority/dto/decision-authority.dto";
import { JournalModel } from "../../journal/dto/journal.dto";
import { OrganizationModel } from "../../organization/dto/organization.dto";
import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportTargetRepository } from "../repository/import-target.repository";
import { ImportRow } from "../types/import.types";
import { AwardDecisionEntity } from "../../award-decision/types/award-decision.types";

export const createImportRepositories = () => ({
    journal: new ImportTargetRepository<JournalModel, ImportRow>(prisma.journal),

    organization: new ImportTargetRepository<OrganizationModel, ImportRow>(prisma.organization),

    awardScheme: new ImportTargetRepository<AwardSchemeModel, ImportRow>(prisma.awardScheme),

    decisionAuthority: new ImportTargetRepository<DecisionAuthorityEntity, ImportRow>(prisma.decisionAuthority),

    awardDecision: new ImportTargetRepository<AwardDecisionEntity, ImportRow>(prisma.awardDecision),
    
    importJob: new ImportJobRepository(prisma.importJob),
});