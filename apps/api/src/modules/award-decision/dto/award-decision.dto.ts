import { Id } from "../../../common/types/types";

export type AwardDecisionDto = {
    id: Id;

    amount: number | null;
    purpose: string | null;
    sourceIdentifier: string | null;
    decisionDate: Date;

    awardSchemeId: Id;

    decisionMakerId: Id;

    recipientId: Id;

    sourceDocumentId: Id;

    createdAt: Date;
    updatedAt: Date | null;
};

export type AwardDecisionWithActorsDto = {
    id: Id;

    amount: number | null;
    purpose: string | null;
    sourceIdentifier: string | null;
    decisionDate: Date;

    awardSchemeId: Id;

    decisionMakerId: Id;
    decisionMakerName: string;

    recipientId: Id;
    recipientName: string;

    sourceDocumentId: Id;

    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateAwardDecisionDto = {
    amount?: number;
    purpose?: string;
    sourceIdentifier?: string;
    decisionDate: Date;

    awardSchemeId: Id;

    decisionMakerId: Id;
    recipientId: Id;

    sourceDocumentId: Id;
};

export type UpdateAwardDecisionDto = Partial<CreateAwardDecisionDto>;