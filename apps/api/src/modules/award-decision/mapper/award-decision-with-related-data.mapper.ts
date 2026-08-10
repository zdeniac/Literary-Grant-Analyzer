import { AwardDecisionWithRelatedDataDto } from "../dto/award-decision.dto";
import { DtoMapper } from "../../../common/types/types";
import { AwardDecisionEntityWithRelatedData } from "../types/award-decision.types";

export const toAwardDecisionWithRelatedDataDto: DtoMapper<AwardDecisionEntityWithRelatedData, AwardDecisionWithRelatedDataDto> = (
    data
) => ({
    id: data.id,

    amount: data.amount
        ? data.amount
        : null,

    purpose: data.purpose,
    sourceIdentifier: data.sourceIdentifier,

    awardSchemeId: data.awardScheme.id,
    awardSchemeName: data.awardScheme.name,

    decisionMakerId: data.decisionMakerId,
    decisionMakerName:
        data.decisionMaker.organization?.name ??
        data.decisionMaker.decisionAuthority?.name ??
        '',

    recipientId: data.recipientId,
    recipientName:
        data.recipient.organization?.name ??
        data.recipient.decisionAuthority?.name ??
        '',

    decisionDate: data.decisionDate,

    sourceDocumentTitle: data.sourceDocument.title,
    sourceDocumentId: data.sourceDocument.id,

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
});