import { AwardDecision, AwardScheme, DecisionBody, Journal, Organization, SourceDocument } from "@prisma/client";
import { PrismaDatabase } from "../types";
import { PrismaCrudRepository } from "./prisma-crud-repository";
import { CreateOrganizationData, UpdateOrganizationDto } from "../../modules/organization/dto/organization.dto";
import { CreateJournalDto, UpdateJournalDto } from "../../modules/journal/dto/journal.dto";
import { CreateAwardSchemeDto } from "../../modules/award-scheme/dto/award-scheme.dto";
import { UpdateAwardDecisionDto } from "../../modules/award-decision/dto/award-decision.dto";
import { CreateDecisionBodyData, UpdateDecisionBodyDto } from "../../modules/decision-body/dto/decision-body.dto";
import { CreateSourceDocumentDto, UpdateSourceDocumentDto } from "../../modules/source-document/dto/source-document.dto";
import { AwardDecisionRepository } from "../../modules/award-decision/award-decision.repository";
import { ActorRepository } from "../../modules/actor/actor.repository";

export function createRepositories(db: PrismaDatabase)
{
    let organization: PrismaCrudRepository<Organization, CreateOrganizationData, UpdateOrganizationDto> | undefined;
    let journal: PrismaCrudRepository<Journal, CreateJournalDto, UpdateJournalDto> | undefined;
    let awardScheme: PrismaCrudRepository<AwardScheme, CreateAwardSchemeDto, UpdateAwardDecisionDto> | undefined;
    let decisionBody: PrismaCrudRepository<DecisionBody, CreateDecisionBodyData, UpdateDecisionBodyDto> | undefined;
    let sourceDocument: PrismaCrudRepository<SourceDocument, CreateSourceDocumentDto, UpdateSourceDocumentDto> | undefined;
    let awardDecision: AwardDecisionRepository | undefined;
    let actor: ActorRepository | undefined;

    return {
        get organization() {
            return organization ??= new PrismaCrudRepository(db.organization);
        },

        get journal() {
            return journal ??= new PrismaCrudRepository(db.journal);
        },

        get awardScheme() {
            return awardScheme ??= new PrismaCrudRepository(db.awardScheme);
        },

        get decisionBody() {
            return decisionBody ??= new PrismaCrudRepository(db.decisionBody);
        },

        get sourceDocument() {
            return sourceDocument ??= new PrismaCrudRepository(db.sourceDocument);
        },

        get awardDecision() {
            return awardDecision ??= new AwardDecisionRepository(db.awardDecision);
        },

        get actor() {
            return actor ??= new ActorRepository(db.actor);
        }
    };
}