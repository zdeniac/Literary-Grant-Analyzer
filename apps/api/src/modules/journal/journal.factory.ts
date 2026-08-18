import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { JournalAffiliationRepository } from "../journal-affiliation/journal-affiliation.repository";
import { JournalController } from "./journal.controller";
import { JournalRepository } from "./journal.repository";
import { JournalService } from "./journal.service";
import { toJournalListDto } from "./mapper/journal-list-mapper";
import { toJournalWithAffiliationsDto } from "./mapper/journal-with-affiliations.mapper";

export const createJournalModule = () => {
    const journoRepo = new JournalRepository(prisma.journal, new ListDbQueryBuilder());
    const affiliationRepo = new JournalAffiliationRepository(prisma.journalAffiliation);
    
    const service = new JournalService(
        journoRepo,
        affiliationRepo,
    );

    const controller = new JournalController(
        service,
        toJournalWithAffiliationsDto,
        toJournalListDto
    );

    return {
        controller,
    }
};