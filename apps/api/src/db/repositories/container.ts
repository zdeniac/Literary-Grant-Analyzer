import { Database } from "../types";
import { PrismaCrudRepository } from "./prisma-crud-repository";
import { AwardDecisionRepository } from "../../modules/award-decision/award-decision.repository";
import { ActorRepository } from "../../modules/actor/actor.repository";
import { JournalRepository } from "../../modules/journal/journal.repository";
import { CreateOrganizationWithActorIdInput, UpdateOrganizationInput } from "../../modules/organization/dto/organization.input.dto";
import { CreateAwardSchemeInput, UpdateAwardSchemeInput } from "../../modules/award-scheme/dto/award-scheme.input.dto";
import { OrganizationEntity } from "../../modules/organization/dto/organization.dto";
import { AwardSchemeEntity } from "../../modules/award-scheme/dto/award-scheme.dto";
import { DecisionAuthorityEntity } from "../../modules/decision-authority/dto/decision-authority.dto";
import { SourceDocumentEntity } from "../../modules/source-document/dto/source-document.dto";
import { CreateSourceDocumentInput, UpdateSourceDocumentInput } from "../../modules/source-document/dto/source-document.input.dto";
import { JournalAffiliationRepository } from "../../modules/journal-affiliation/journal-affiliation.repository";
import { ImportJobRepository } from "../../modules/data-import/repository/import-job.repository";
import { ImportJobSourceDocumentRepository } from "../../modules/import-job-source-document/import-job-source-document.repository";
import { PersonDto } from "../../modules/person/dto/person.dto";
import { CreatePersonWithActorIdInput, UpdatePersonInput } from "../../modules/person/dto/person.input";
import { CreateDecisionAuthorityWithActorIdInput, UpdateDecisionAuthorityInput } from "../../modules/decision-authority/dto/decision-authority.input.dto";

export function repositoryContainer(db: Database)
{
    let actor: ActorRepository | undefined;

    let organization: PrismaCrudRepository<
        OrganizationEntity, 
        CreateOrganizationWithActorIdInput, 
        UpdateOrganizationInput
    > | undefined;

    let journal: JournalRepository | undefined;
    let journalAffiliation: JournalAffiliationRepository | undefined;

    let person: PrismaCrudRepository<PersonDto, CreatePersonWithActorIdInput, UpdatePersonInput> | undefined;

    let awardScheme: PrismaCrudRepository<
        AwardSchemeEntity, 
        CreateAwardSchemeInput, 
        UpdateAwardSchemeInput
    > | undefined;
    
    let decisionAuthority: PrismaCrudRepository<
        DecisionAuthorityEntity, 
        CreateDecisionAuthorityWithActorIdInput, 
        UpdateDecisionAuthorityInput
    > | undefined;

    let awardDecision: AwardDecisionRepository | undefined;

    let sourceDocument: PrismaCrudRepository<
        SourceDocumentEntity, 
        CreateSourceDocumentInput, 
        UpdateSourceDocumentInput
    > | undefined;
    
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

        get person() {
            return person ??= new PrismaCrudRepository(db.person);
        }
    };
}