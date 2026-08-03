import { AwardSchemeDto, AwardSchemeModel } from "../dto/award-scheme.dto";
import { DtoMapper } from "../../../common/types/types";

export const toAwardSchemeDto: DtoMapper<AwardSchemeModel, AwardSchemeDto> = (
    awardScheme
) => ({
    id: awardScheme.id,

    name: awardScheme.name,
    type: awardScheme.type,
    fundingArea: awardScheme.fundingArea,


    organizationId: awardScheme.organizationId,

    createdAt: awardScheme.createdAt,
    updatedAt: awardScheme.updatedAt,
});