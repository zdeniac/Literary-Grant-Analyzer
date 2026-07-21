import { Prisma } from "@prisma/client";
import { AwardDecisionDto } from "../dto/award-decision.dto";

export type AwardDecisionModel = AwardDecisionDto;

export type AwardDecisionWithActors = Prisma.AwardDecisionGetPayload<{
    include: {
        decisionMaker: {
            include: {
                organization: true;
                decisionBody: true;
            };
        };
        recipient: {
            include: {
                organization: true;
                decisionBody: true;
            };
        };
    };
}>;
