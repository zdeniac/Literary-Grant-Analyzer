import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { toJournalDto } from "./mapper/journal.mapper";

export const createJournalModule = () => {
    const controller = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.journal)),
        toJournalDto,
    );
    
    return {
        controller,
    }
};