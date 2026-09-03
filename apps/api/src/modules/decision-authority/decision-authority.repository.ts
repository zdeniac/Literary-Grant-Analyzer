import { Id, ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { CrudRepositoryInterface, Database } from "../../db/types";
import { DecisionAuthorityEntity } from "./dto/decision-authority.dto";
import { CreateDecisionAuthorityInput, UpdateDecisionAuthorityInput } from "./dto/decision-authority.input.dto";

export class DecisionAuthorityRepository
{
    constructor(
        private readonly entity: Database['decisionAuthority'],
        private readonly crud: CrudRepositoryInterface<
            DecisionAuthorityEntity, 
            CreateDecisionAuthorityInput, 
            UpdateDecisionAuthorityInput
        >,
        private readonly listQueryBuilder?: ListDbQueryBuilder,
    ) {}

    async create(data: CreateDecisionAuthorityInput): Promise<DecisionAuthorityEntity>
    {
        return this.crud.create(data);
    }

    async update(id: number, data: UpdateDecisionAuthorityInput): Promise<DecisionAuthorityEntity>
    {
        return this.crud.update(id, data);
    }
    
    async findById(id: number): Promise<DecisionAuthorityEntity | null>
    {
        return this.crud.findById(id);
    }
    
    async findByIdOrThrow(id: Id): Promise<DecisionAuthorityEntity>
    {
        return this.crud.findByIdOrThrow(id);
    }

    async findAll(query?: ListQueryParams): Promise<DecisionAuthorityEntity[]>
    {
        return this.entity.findMany(this.listQueryBuilder?.build(query));
    }

    async delete(id: Id): Promise<DecisionAuthorityEntity>
    {
        return this.crud.delete(id);
    }

    async count(): Promise<number>
    {
        return this.crud.count();
    }
}