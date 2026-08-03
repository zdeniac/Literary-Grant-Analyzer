import { PrismaDatabase } from "../types";
import { PrismaCrudRepository } from "./prisma-crud-repository";
import { AwardDecisionRepository } from "../../modules/award-decision/award-decision.repository";
import { ActorRepository } from "../../modules/actor/actor.repository";
import { JournalRepository } from "../../modules/journal/journal.repository";
import { CreateOrganizationInputWithActorId, UpdateOrganizationInput } from "../../modules/organization/dto/organization.input.dto";
import { CreateAwardSchemeInput, UpdateAwardSchemeInput } from "../../modules/award-scheme/dto/award-scheme.input.dto";
import { CreateDecisionBodyData, UpdateDecisionBodyInput } from "../../modules/decision-authority/dto/decision-authority.input.dto";
import { OrganizationModel } from "../../modules/organization/dto/organization.dto";
import { AwardSchemeModel } from "../../modules/award-scheme/dto/award-scheme.dto";
import { DecisionAuthorityModel } from "../../modules/decision-authority/dto/decision-authority.dto";
import { SourceDocumentModel } from "../../modules/source-document/dto/source-document.dto";
import { CreateSourceDocumentInput, UpdateSourceDocumentInput } from "../../modules/source-document/dto/source-document.input.dto";
import { JournalAffiliationRepository } from "../../modules/journal-affiliation/journal-affiliation.repository";
import { ImportJobRepository } from "../../modules/data-import/repository/import-job.repository";
import { ImportJobSourceDocumentRepository } from "../../modules/import-job-source-document/import-job-source-document.repository";

export function createRepositories(db: PrismaDatabase)
{
    let actor: ActorRepository | undefined;

    let organization: PrismaCrudRepository<OrganizationModel, CreateOrganizationInputWithActorId, UpdateOrganizationInput> | undefined;
    let journal: JournalRepository | undefined;
    let journalAffiliation: JournalAffiliationRepository | undefined;

    let awardScheme: PrismaCrudRepository<AwardSchemeModel, CreateAwardSchemeInput, UpdateAwardSchemeInput> | undefined;
    let decisionAuthority: PrismaCrudRepository<DecisionAuthorityModel, CreateDecisionBodyData, UpdateDecisionBodyInput> | undefined;
    let awardDecision: AwardDecisionRepository | undefined;

    let sourceDocument: PrismaCrudRepository<SourceDocumentModel, CreateSourceDocumentInput, UpdateSourceDocumentInput> | undefined;
    let importJob: ImportJobRepository | undefined;
    let importJobSourceDocument: ImportJobSourceDocumentRepository | undefined;

    return {
        get organization() {
            return organization ??= new PrismaCrudRepository(db.organization);
        },

        get journal() {
            return journal ??= new JournalRepository(db.journal);
        },

        get journalAffiliation() {
            return journalAffiliation ??= new JournalAffiliationRepository(db.journalAffiliation);
        },

        get awardScheme() {
            return awardScheme ??= new PrismaCrudRepository(db.awardScheme);
        },

        get decisionAuthority() {
            return decisionAuthority ??= new PrismaCrudRepository(db.decisionAuthority);
        },

        get sourceDocument() {
            return sourceDocument ??= new PrismaCrudRepository(db.sourceDocument);
        },

        get awardDecision() {
            return awardDecision ??= new AwardDecisionRepository(db.awardDecision);
        },

        get actor() {
            return actor ??= new ActorRepository(db.actor);
        },

        get importJob() {
            return importJob ??= new ImportJobRepository(db.importJob);
        },

        get importJobSourceDocument() {
            return importJobSourceDocument ??= new ImportJobSourceDocumentRepository(db.importJobSourceDocument);
        },
    };
}