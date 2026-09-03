import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { Database } from "../../db/types";
import { toPersonDto } from "./mapper/person.mapper";
import { PersonController } from "./person.controller";
import { PersonRepository } from "./person.repository";
import { PersonService } from "./person.service";

export const createPersonModule = () => {
    const service = new PersonService(
        createPersonRepository(prisma.person, true)
    );
    
    return {
        controller: new PersonController(service, toPersonDto),
    }
};

export const createPersonRepository = (person: Database['person'], withQueryBuilders?: boolean) => {
    const crudRepo = new PrismaCrudRepository(person);

    const listQb = withQueryBuilders ? new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    ) : undefined;

    return new PersonRepository(person, crudRepo, listQb);
}