import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { JournalAffiliationRepository } from "../journal-affiliation/journal-affiliation.repository";
import { JournalController } from "./journal.controller";
import { JournalRepository } from "./journal.repository";
import { JournalService } from "./journal.service";
import { toJournalDto } from "./mapper/journal-dto.mapper";

export const createJournalModule = () => {
    const controller = new JournalController(
        new JournalService(
            new JournalRepository(prisma.journal),
            new JournalAffiliationRepository(prisma.journalAffiliation)
        ),
    )

    const crudController = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.journal)),
        toJournalDto,
    );
    
    return {
        crudController,
        controller,
    }
};