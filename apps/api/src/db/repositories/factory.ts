import { PrismaDatabase } from "../types";
import { PrismaCrudRepository } from "./prisma-crud-repository";
import { AwardDecisionRepository } from "../../modules/award-decision/award-decision.repository";
import { ActorRepository } from "../../modules/actor/actor.repository";
import { JournalRepository } from "../../modules/journal/journal.repository";
import { CreateOrganizationInputWithActorId, UpdateOrganizationInput } from "../../modules/organization/dto/organization.input.dto";
import { CreateAwardSchemeInput, UpdateAwardSchemeInput } from "../../modules/award-scheme/dto/award-scheme.input.dto";
import { CreateDecisionBodyData, UpdateDecisionBodyInput } from "../../modules/decision-body/dto/decision-body.input.dto";
import { OrganizationModel } from "../../modules/organization/dto/organization.dto";
import { AwardSchemeModel } from "../../modules/award-scheme/dto/award-scheme.dto";
import { DecisionBodyModel } from "../../modules/decision-body/dto/decision-body.dto";
import { SourceDocumentModel } from "../../modules/source-document/dto/source-document.dto";
import { CreateSourceDocumentInput, UpdateSourceDocumentInput } from "../../modules/source-document/dto/source-document.input.dto";

export function createRepositories(db: PrismaDatabase)
{
    let organization: PrismaCrudRepository<OrganizationModel, CreateOrganizationInputWithActorId, UpdateOrganizationInput> | undefined;
    let journal: JournalRepository | undefined;
    let awardScheme: PrismaCrudRepository<AwardSchemeModel, CreateAwardSchemeInput, UpdateAwardSchemeInput> | undefined;
    let decisionBody: PrismaCrudRepository<DecisionBodyModel, CreateDecisionBodyData, UpdateDecisionBodyInput> | undefined;
    let sourceDocument: PrismaCrudRepository<SourceDocumentModel, CreateSourceDocumentInput, UpdateSourceDocumentInput> | undefined;
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