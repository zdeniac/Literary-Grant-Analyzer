import { ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { Database } from "../../db/types";
import { AwardSchemeEntity } from "./dto/award-scheme.dto";

export class AwardSchemeRepository
{
    constructor(
        private readonly entity: Database['awardScheme'],
        private readonly listQueryBuilder?: ListDbQueryBuilder,
    ) {}

    async findAll(query?: ListQueryParams): Promise<AwardSchemeEntity[]>
    {
        return this.entity.findMany(this.listQueryBuilder?.build(query))
    }
}