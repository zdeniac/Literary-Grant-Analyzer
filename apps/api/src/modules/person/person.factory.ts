import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { toPersonDto } from "./mapper/person.mapper";
import { PersonController } from "./person.controller";
import { PersonService } from "./person.service";

export const createPersonModule = () => {
    const crudRepository = new PrismaCrudRepository(prisma.person);
    const crudService = new CrudService(crudRepository);

    const service = new PersonService();
    
    return {
        controller: new PersonController(service, toPersonDto),
        crudController: new CrudController(crudService, toPersonDto)
    }
};