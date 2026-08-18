import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { toPersonDto } from "./mapper/person.mapper";
import { PersonController } from "./person.controller";
import { PersonRepository } from "./person.repository";
import { PersonService } from "./person.service";

export const createPersonModule = () => {
    const entity = prisma.person;

    const crudRepository = new PrismaCrudRepository(entity);
    const personRepo = new PersonRepository(
        entity,
        crudRepository,
        new ListDbQueryBuilder(),
    );

    const service = new PersonService(personRepo);
    
    return {
        controller: new PersonController(service, toPersonDto),
    }
};