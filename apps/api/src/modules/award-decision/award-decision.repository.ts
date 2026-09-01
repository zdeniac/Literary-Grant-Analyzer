import { Id, ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { CrudRepositoryInterface, Database } from "../../db/types";
import { CreateAwardDecisionInput, UpdateAwardDecisionInput } from "./dto/award-decision.input.dto";
import { AwardDecisionEntity, AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionRepository
{
    constructor(
        private readonly entity: Database['awardDecision'],
        private readonly crud: CrudRepositoryInterface<
            AwardDecisionEntity, 
            CreateAwardDecisionInput, 
            UpdateAwardDecisionInput
        >,
        private readonly listQueryBuilder?: ListDbQueryBuilder
    ) {}

    async create(data: CreateAwardDecisionInput): Promise<AwardDecisionEntity>
    {
        return this.crud.create(data);
    }

    async findByIdOrThrow(id: Id): Promise<AwardDecisionEntity | null>
    {
        return this.crud.findByIdOrThrow(id);
    }

    async update(id: Id, data: UpdateAwardDecisionInput): Promise<AwardDecisionEntity>
    {
        return this.crud.update(id, data);
    }

    async delete(id: Id): Promise<AwardDecisionEntity>
    {
        return this.crud.delete(id);
    }

    async findAllWithRelatedData(query?: ListQueryParams): Promise<AwardDecisionEntityWithRelatedData[]>
    {
        return this.entity.findMany({
            include: {
                decisionMaker: {
                    select: {
                        type: true,
                        organization: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        decisionAuthority: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    },
                },
                recipient: {
                    select: {
                        type: true,
                        organization: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        person: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                sourceDocument: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                awardScheme: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
            ...this.listQueryBuilder?.build(query)
        });
    }
}