import { ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { CrudRepositoryInterface, Database } from "../../db/types";
import { OrganizationEntity } from "./dto/organization.dto";
import { CreateOrganizationInput, UpdateOrganizationInput } from "./dto/organization.input.dto";

export class OrganizationRepository
{
    constructor(
        private readonly entity: Database['organization'],
        private readonly crud: CrudRepositoryInterface<
            OrganizationEntity,
            CreateOrganizationInput,
            UpdateOrganizationInput
        >,
        private readonly listQueryBuilder: ListDbQueryBuilder,
    ) {}

    async create(data: CreateOrganizationInput): Promise<OrganizationEntity>
    {
        return this.crud.create(data);
    }

    async update(id: number, data: UpdateOrganizationInput): Promise<OrganizationEntity>
    {
        return this.crud.update(id, data);
    }

    async findByIdOrThrow(id: number): Promise<OrganizationEntity>
    {
        return this.crud.findByIdOrThrow(id);
    }

    async delete(id: number): Promise<OrganizationEntity>
    {
        return this.crud.delete(id);
    }

    async findAll(query?: ListQueryParams): Promise<OrganizationEntity[]>
    {
        return this.entity.findMany({ ...this.listQueryBuilder.build(query) });
    }
}