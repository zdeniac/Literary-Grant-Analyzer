import { AwardDecisionWithActorsDto } from "../dto/award-decision.dto";
import { DtoMapper } from "../../../common/types/types";
import { AwardDecisionWithActors } from "../types/award-decision.types";

export const toAwardDecisionWithActorsDto: DtoMapper<AwardDecisionWithActors, AwardDecisionWithActorsDto> = (
    awardDecisionWithActors
) => ({
    id: awardDecisionWithActors.id,

    amount: awardDecisionWithActors.amount
        ? Number(awardDecisionWithActors.amount)
        : null,

    purpose: awardDecisionWithActors.purpose,
    sourceIdentifier: awardDecisionWithActors.sourceIdentifier,
    decisionDate: awardDecisionWithActors.decisionDate,

    awardSchemeId: awardDecisionWithActors.awardSchemeId,

    decisionMakerId: awardDecisionWithActors.decisionMakerId,
    decisionMakerName:
        awardDecisionWithActors.decisionMaker.organization?.name ??
        awardDecisionWithActors.decisionMaker.decisionBody?.name ??
        '',

    recipientId: awardDecisionWithActors.recipientId,
    recipientName:
        awardDecisionWithActors.recipient.organization?.name ??
        awardDecisionWithActors.recipient.decisionBody?.name ??
        '',

    sourceDocumentId: awardDecisionWithActors.sourceDocumentId,

    createdAt: awardDecisionWithActors.createdAt,
    updatedAt: awardDecisionWithActors.updatedAt,
});