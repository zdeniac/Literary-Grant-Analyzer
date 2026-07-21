import { AwardScheme, DecisionBody, Organization, SourceDocument } from "@prisma/client";
import { PrismaDatabase } from "../types";
import { PrismaCrudRepository } from "./prisma-crud-repository";
import { CreateOrganizationData, UpdateOrganizationInput } from "../../modules/organization/dto/organization.dto";
import { CreateAwardSchemeDto } from "../../modules/award-scheme/dto/award-scheme.dto";
import { UpdateAwardDecisionDto } from "../../modules/award-decision/dto/award-decision.dto";
import { CreateDecisionBodyData, UpdateDecisionBodyInput } from "../../modules/decision-body/dto/decision-body.dto";
import { CreateSourceDocumentInput, UpdateSourceDocumentInput } from "../../modules/source-document/dto/source-document.dto";
import { AwardDecisionRepository } from "../../modules/award-decision/award-decision.repository";
import { ActorRepository } from "../../modules/actor/actor.repository";
import { JournalRepository } from "../../modules/journal/journal.repository";

export function createRepositories(db: PrismaDatabase)
{
    let organization: PrismaCrudRepository<Organization, CreateOrganizationData, UpdateOrganizationInput> | undefined;
    let journal: JournalRepository | undefined;
    let awardScheme: PrismaCrudRepository<AwardScheme, CreateAwardSchemeDto, UpdateAwardDecisionDto> | undefined;
    let decisionBody: PrismaCrudRepository<DecisionBody, CreateDecisionBodyData, UpdateDecisionBodyInput> | undefined;
    let sourceDocument: PrismaCrudRepository<SourceDocument, CreateSourceDocumentInput, UpdateSourceDocumentInput> | undefined;
    let awardDecision: AwardDecisionRepository | undefined;
    let actor: ActorRepository | undefined;

    return {
        get organization() {
            return organization ??= new PrismaCrudRepository(db.organization);
        },

        get journal() {
            return journal ??= new JournalRepository(db.journal);
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