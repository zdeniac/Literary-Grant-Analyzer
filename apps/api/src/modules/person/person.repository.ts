import { CrudRepositoryInterface, Database } from "../../db/types";
import { PersonEntity } from "./dto/person.dto";
import { CreatePersonInput, UpdatePersonInput } from "./dto/person.input";
import { ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";

export class PersonRepository
{
    constructor(
        private readonly entity: Database['person'],
        private readonly crud: CrudRepositoryInterface<
            PersonEntity, 
            CreatePersonInput, 
            UpdatePersonInput
        >,
        private readonly listQueryBuilder?: ListDbQueryBuilder,
    ) {}

    async create(data: CreatePersonInput): Promise<PersonEntity>
    {
        return this.crud.create(data);
    }

    async update(id: number, data: UpdatePersonInput): Promise<PersonEntity>
    {
        return this.crud.update(id, data);
    }

    async findByIdOrThrow(id: number): Promise<PersonEntity>
    {
        return this.crud.findByIdOrThrow(id);
    }

    async delete(id: number): Promise<PersonEntity>
    {
        return this.crud.delete(id);
    }

    async findAll(query?: ListQueryParams): Promise<PersonEntity[]>
    {
        return this.entity.findMany(this.listQueryBuilder?.build(query));
    }
}