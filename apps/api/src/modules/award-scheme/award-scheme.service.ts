import { ListQueryParams } from "../../common/types/types";
import { AwardSchemeRepository } from "./award-scheme.repository";
import { AwardSchemeEntity } from "./dto/award-scheme.dto";
import { AwardSchemeSortableField } from "./types/award-scheme.types";

export class AwardSchemeService
{
    constructor(
        private readonly repository: AwardSchemeRepository,
    ) {}

    async getList(query?: ListQueryParams<AwardSchemeSortableField>): Promise<AwardSchemeEntity[]>
    {
        return this.repository.findAll(query);
    }
}