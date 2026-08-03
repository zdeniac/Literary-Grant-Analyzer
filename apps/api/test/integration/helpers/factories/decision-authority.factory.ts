import { Id } from "../../../../src/common/types/types";
import { prisma } from "../../../../src/db/prisma";
import { DecisionBodyService } from "../../../../src/modules/decision-body/decision-body.service";
import { ActorRepository } from "../../../../src/modules/actor/actor.repository";
import { PrismaCrudRepository } from "../../../../src/db/repositories/prisma-crud-repository";
import { CrudService } from "../../../../src/common/services/crud.service";
import { DecisionBodyModel } from "../../../../src/modules/decision-body/dto/decision-body.dto";
import { UpdateDecisionBodyInput } from "../../../../src/modules/decision-body/dto/decision-body.input.dto";

const repo = new PrismaCrudRepository(prisma.decisionBody)
const decisionBodyService = new DecisionBodyService(
    repo,
    new ActorRepository(prisma.actor)
);

const crudService = new CrudService(repo);

export const createDecisionBody = async (overrides: {
    name?: string,
    organizationId: Id, 
}): Promise<DecisionBodyModel> => {
    return decisionBodyService.create({
        name: overrides.name ?? 'Szépirodalom Kollégium',
        organizationId: overrides.organizationId, 
    });
};

export const findDecisionBodyById = async (id: Id): Promise<DecisionBodyModel | undefined> => 
    await crudService.findById(id);

export const findEveryDecisionBody = async (): Promise<DecisionBodyModel[]> => 
    await crudService.findAll();

export const deleteDecisionBody = async (id: Id): Promise<DecisionBodyModel> => 
    await decisionBodyService.delete(id);

export const updateDecisionBody = async (id: Id, data: UpdateDecisionBodyInput): Promise<DecisionBodyModel> => 
    await crudService.update(id, data);