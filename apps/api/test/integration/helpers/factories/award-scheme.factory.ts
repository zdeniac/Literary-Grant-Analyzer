import { AwardScheme, AwardSchemeType } from "@prisma/client";
import { Id } from "../../../../src/common/types/types";
import { prisma } from "../../../../src/db/prisma";
import { PrismaCrudRepository } from "../../../../src/db/repositories/prisma-crud-repository";
import { CrudService } from "../../../../src/common/services/crud.service";
import { AwardSchemeDto, AwardSchemeModel } from "../../../../src/modules/award-scheme/dto/award-scheme.dto";

const awardSchemeCrudService = new CrudService(
    new PrismaCrudRepository<AwardSchemeModel, AwardSchemeDto, AwardSchemeDto>(prisma.awardScheme)
);

export const createAwardScheme = async (overrides: {
    name: string,
    type: AwardSchemeType,
    organizationId: Id, 
}): Promise<AwardScheme> => {
    return awardSchemeCrudService.create({
        name: overrides.name,
        type: overrides.type,
        organizationId: overrides.organizationId,
    } as AwardSchemeDto);
};

export const findAwardSchemeById = async (id: Id): Promise<AwardScheme | undefined> => 
    await awardSchemeCrudService.findById(id);

export const findEveryAwardScheme = async (): Promise<AwardScheme[]> => 
    await awardSchemeCrudService.findAll();

export const deleteAwardScheme = async (id: Id): Promise<AwardScheme> => 
    await awardSchemeCrudService.delete(id);

export const updateAwardScheme = async (id: Id, data: AwardSchemeDto): Promise<AwardScheme> => 
    await awardSchemeCrudService.update(id, data);