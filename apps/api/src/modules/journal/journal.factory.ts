import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { JournalOrganizationRepository } from "../journal-organization/journal-organization.repository";
import { JournalController } from "./journal.controller";
import { JournalRepository } from "./journal.repository";
import { JournalService } from "./journal.service";
import { toJournalDto } from "./mapper/journal-dto.mapper";
import { toJournalWithOrganizationsDto } from "./mapper/journal-with-organizations.mapper";

export const createJournalModule = () => {
    const controller = new JournalController(
        new JournalService(
            new JournalRepository(prisma.journal),
            new JournalOrganizationRepository(prisma.journalOrganization)
        ),
        toJournalWithOrganizationsDto
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