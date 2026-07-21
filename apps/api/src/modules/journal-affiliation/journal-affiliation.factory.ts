import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { toJournalAffiliationDto } from "./mapper/journal-affiliation.mapper";

export const createJournalAffiliationModule = () => {
    const controller = new CrudController(
        new CrudService(
            new PrismaCrudRepository(prisma.journalAffiliation)
        ),
        toJournalAffiliationDto,
    )

    return {
        controller,
    }
};