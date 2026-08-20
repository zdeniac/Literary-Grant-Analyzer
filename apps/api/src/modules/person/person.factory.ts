import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { toPersonDto } from "./mapper/person.mapper";
import { PersonController } from "./person.controller";
import { PersonRepository } from "./person.repository";
import { PersonService } from "./person.service";

export const createPersonModule = () => {
    const entity = prisma.person;

    const listQb = new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    );

    const crudRepository = new PrismaCrudRepository(entity);
    const personRepo = new PersonRepository(
        entity,
        crudRepository,
        listQb,
    );

    const service = new PersonService(personRepo);
    
    return {
        controller: new PersonController(service, toPersonDto),
    }
};