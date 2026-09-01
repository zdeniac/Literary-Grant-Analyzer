import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { Database } from "../../db/types";
import { JournalAffiliationRepository } from "../journal-affiliation/journal-affiliation.repository";
import { JournalController } from "./journal.controller";
import { JournalRepository } from "./journal.repository";
import { JournalService } from "./journal.service";
import { toJournalListDto } from "./mapper/journal-list-mapper";
import { toJournalWithAffiliationsDto } from "./mapper/journal-with-affiliations.mapper";

export const createJournalModule = () => {
    const listQb = new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    );

    const journoRepo = new JournalRepository(prisma.journal, listQb);
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

export const createJournalRepository = (entity: Database['journal'], withQueryBuilders?: boolean) => {
    const listQb = withQueryBuilders ? new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    ) : undefined;

    return new JournalRepository(entity, listQb);
}