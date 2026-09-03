import { ActorType } from "@prisma/client";
import { DecisionAuthorityEntity } from "./dto/decision-authority.dto";
import { transaction } from "../../db/transaction";
import { Id, ListQueryParams } from "../../common/types/types";
import { repositoryContainer } from "../../db/repositories/container";
import { CreateDecisionAuthorityInput, UpdateDecisionAuthorityInput } from "./dto/decision-authority.input.dto";
import { DecisionAuthorityRepository } from "./decision-authority.repository";

export class DecisionAuthorityService
{
    constructor(
        private readonly repository: DecisionAuthorityRepository
    ) {}

    async create(dto: CreateDecisionAuthorityInput): Promise<DecisionAuthorityEntity>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const actor = await repositories.actor.create(
                ActorType.DECISION_AUTHORITY
            );

            return repositories.decisionAuthority.create({
                ...dto,
                actorId: actor.id,
            });
        });    
    }

    async update(id: number, data: UpdateDecisionAuthorityInput): Promise<DecisionAuthorityEntity>
    {
        return this.repository.update(id, data);
    }

    async delete(id: Id): Promise<DecisionAuthorityEntity>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const decisionAuthority = await repositories.decisionAuthority.delete(id);

            await repositories.actor.delete(decisionAuthority.actorId);

            return decisionAuthority;
        });
    }

    async deleteMany(ids: Id[]): Promise<number>
    {
        await transaction(async tx => {
            const repositories = repositoryContainer(tx);

            for (const id of ids) {
                const decisionAuthority = await repositories.decisionAuthority.delete(id);
                
                await repositories.actor.delete(decisionAuthority.actorId);
            }
        })

        return ids.length;
    }

    async getList(query?: ListQueryParams): Promise<DecisionAuthorityEntity[]>
    {
        return this.repository.findAll(query);
    }

    async getCount(): Promise<number>
    {
        return this.repository.count();
    }

    async findById(id: number): Promise<DecisionAuthorityEntity>
    {
        return this.repository.findByIdOrThrow(id);
    }
}