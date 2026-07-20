import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { toJournalOrganizationDto } from "./mapper/journal-organization.dto";

export const createJournalOrganizationModule = () => {
    const controller = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.journalOrganization)),
        toJournalOrganizationDto,
    )

    return {
        controller,
    }
};