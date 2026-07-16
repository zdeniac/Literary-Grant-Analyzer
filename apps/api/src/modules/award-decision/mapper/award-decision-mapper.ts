import { AwardDecision } from "@prisma/client";
import { AwardDecisionDto } from "../dto/award-decision.dto";

export const toAwardDecisionDto = (awardDecision: AwardDecision): AwardDecisionDto => ({
    id: awardDecision.id,

    amount: Number(awardDecision.amount),
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