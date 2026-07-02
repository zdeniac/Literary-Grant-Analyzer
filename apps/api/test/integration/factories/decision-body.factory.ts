import { DecisionBody } from "@prisma/client";
import { Id } from "../../../src/common/types/types";
import { prisma } from "../../../src/db/prisma";
import { DecisionBodyRepository } from "../../../src/modules/decision-body/decision-body.repository";
import { DecisionBodyService } from "../../../src/modules/decision-body/decision-body.service";
import { UpdateDecisionBodyDto } from "../../../src/modules/decision-body/dto/decision-body.dto";

const decisionBodyService = new DecisionBodyService(new DecisionBodyRepository(prisma.decisionBody));

export const createDecisionBody = async (overrides: {
    name?: string,
    organizationId: Id, 
}): Promise<DecisionBody> => {
    return decisionBodyService.create({
        name: overrides.name ?? 'Szépirodalom Kollégium',
        organizationId: overrides.organizationId, 
    });
};

export const findDecisionBodyById = async (id: Id): Promise<DecisionBody | undefined> => 
    await decisionBodyService.findById(id);

export const findEveryDecisionBody = async (): Promise<DecisionBody[]> => 
    await decisionBodyService.findAll();

export const deleteDecisionBody = async (id: Id): Promise<void> => 
    await decisionBodyService.delete(id);

export const updateDecisionBody = async (id: Id, data: UpdateDecisionBodyDto): Promise<DecisionBody> => 
    await decisionBodyService.update(id, data);