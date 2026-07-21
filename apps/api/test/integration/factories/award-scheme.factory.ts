import { AwardScheme, AwardSchemeType } from "@prisma/client";
import { Id } from "../../../src/common/types/types";
import { prisma } from "../../../src/db/prisma";
import { AwardSchemeRepository as AwardSchemeRepository } from "../../../src/modules/award-scheme/award-scheme.repository";
import { AwardSchemeService } from "../../../src/modules/award-scheme/award-scheme.service";
import { UpdateAwardSchemeInput  } from "../../../src/modules/award-scheme/dto/award-scheme.dto";

const awardSchemeService = new AwardSchemeService(new AwardSchemeRepository(prisma));

export const createAwardScheme = async (overrides: {
    name: string,
    type: AwardSchemeType,
    organizationId: Id, 
}): Promise<AwardScheme> => {
    return awardSchemeService.create({
        name: overrides.name,
        type: overrides.type,
        organizationId: overrides.organizationId,
    });
};

export const findAwardSchemeById = async (id: Id): Promise<AwardScheme | undefined> => 
    await awardSchemeService.findById(id);

export const findEveryAwardScheme = async (): Promise<AwardScheme[]> => 
    await awardSchemeService.findAll();

export const deleteAwardScheme = async (id: Id): Promise<AwardScheme> => 
    await awardSchemeService.delete(id);

export const updateAwardScheme = async (id: Id, data: UpdateAwardSchemeInput): Promise<AwardScheme> => 
    await awardSchemeService.update(id, data);