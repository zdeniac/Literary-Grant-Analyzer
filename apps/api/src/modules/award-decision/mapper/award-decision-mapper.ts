import { AwardDecisionDto } from "../dto/award-decision.dto";
import { AwardDecisionModel } from "../types/award-decision.types";

export const toAwardDecisionDto = (awardDecision: AwardDecisionModel): AwardDecisionDto => ({
    id: awardDecision.id,

    amount: awardDecision.amount,
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