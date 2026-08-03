import { Id } from "../../../../src/common/types/types";
import { prisma } from "../../../../src/db/prisma";
import { DecisionAuthorityService } from "../../../../src/modules/decision-authority/decision-authority.service";
import { ActorRepository } from "../../../../src/modules/actor/actor.repository";
import { PrismaCrudRepository } from "../../../../src/db/repositories/prisma-crud-repository";
import { CrudService } from "../../../../src/common/services/crud.service";
import { DecisionAuthorityModel } from "../../../../src/modules/decision-authority/dto/decision-authority.dto";
import { UpdateDecisionAuthorityInput } from "../../../../src/modules/decision-authority/dto/decision-authority.input.dto";

const repo = new PrismaCrudRepository(prisma.decisionAuthority)
const decisionAuthorityService = new DecisionAuthorityService(
    repo,
    new ActorRepository(prisma.actor)
);

const crudService = new CrudService(repo);

export const createDecisionAuthority = async (overrides: {
    name?: string,
    organizationId: Id, 
}): Promise<DecisionAuthorityModel> => {
    return decisionAuthorityService.create({
        name: overrides.name ?? 'Szépirodalom Kollégium',
        organizationId: overrides.organizationId, 
    });
};

export const findDecisionAuthorityById = async (id: Id): Promise<DecisionAuthorityModel | undefined> => 
    await crudService.findById(id);

export const findEveryDecisionAuthority = async (): Promise<DecisionAuthorityModel[]> => 
    await crudService.findAll();

export const deleteDecisionAuthority = async (id: Id): Promise<DecisionAuthorityModel> => 
    await decisionAuthorityService.delete(id);

export const updateDecisionAuthority = async (id: Id, data: UpdateDecisionAuthorityInput): Promise<DecisionAuthorityModel> => 
    await crudService.update(id, data);