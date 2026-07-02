import { AwardScheme } from "@prisma/client";
import { AwardSchemeDto } from "../dto/award-scheme.dto";
import { DtoMapper } from "../../../common/types/types";

export const toAwardSchemeDto: DtoMapper<AwardScheme, AwardSchemeDto> = (
    awardScheme
) => ({
    id: awardScheme.id,

    name: awardScheme.name,
    type: awardScheme.type,
    organizationId: awardScheme.organizationId,

    createdAt: awardScheme.createdAt,
    updatedAt: awardScheme.updatedAt,
});