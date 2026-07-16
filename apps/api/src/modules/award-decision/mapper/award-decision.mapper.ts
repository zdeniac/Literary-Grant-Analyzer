import { AwardDecision } from "@prisma/client";
import { AwardDecisionDto } from "../dto/award-decision.dto";
import { DtoMapper } from "../../../common/types/types";

export const toAwardDecisionDto: DtoMapper<AwardDecision, AwardDecisionDto> = (
    awardDecision
) => ({
    id: awardDecision.id,

    amount: Number(awardDecision.amount) ?? null,
    purpose: awardDecision.purpose,
    sourceIdentifier: awardDecision.sourceIdentifier,
    decisionDate: awardDecision.decisionDate,

    awardSchemeId: awardDecision.awardSchemeId,

    decisionMakerId: awardDecision.decisionMakerId,
    recipientId: awardDecision.recipientId,

    sourceDocumentId: awardDecision.sourceDocumentId,

    createdAt: awardDecision.createdAt,
    updatedAt: awardDecision.updatedAt,
});