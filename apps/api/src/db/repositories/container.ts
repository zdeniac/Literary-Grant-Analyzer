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
import { JournalAffiliationRepository } from "../../modules/journal-affiliation/journal-affiliation.repository";
import { ImportJobRepository } from "../../modules/data-import/repository/import-job.repository";
import { ImportJobSourceDocumentRepository } from "../../modules/import-job-source-document/import-job-source-document.repository";
import { PersonDto } from "../../modules/person/dto/person.dto";
import { CreatePersonWithActorIdInput, UpdatePersonInput } from "../../modules/person/dto/person.input";
import { CreateDecisionAuthorityWithActorIdInput, UpdateDecisionAuthorityInput } from "../../modules/decision-authority/dto/decision-authority.input.dto";
import { SourceDocumentRepository } from "../../modules/source-document/source-document.repository";
import { createAwardDecisionRepository } from "../../modules/award-decision/award-decision.factory";
import { createJournalAffiliationRepository, createJournalRepository } from "../../modules/journal/journal.factory";
import { createSourceDocumentRepository } from "../../modules/source-document/source-document.factories";
import { createOrganizationRepository } from "../../modules/organization/organization.factory";
import { OrganizationRepository } from "../../modules/organization/organization.repository";
import { createActorRepository } from "../../modules/actor/actor.factory";
import { create } from "domain";
import { createAwardSchemeRepository } from "../../modules/award-scheme/award-scheme.factory";
import { AwardSchemeRepository } from "../../modules/award-scheme/award-scheme.repository";
import { createDecisionAuthorityRepository } from "../../modules/decision-authority/decision-authority.factory";
import { DecisionAuthorityRepository } from "../../modules/decision-authority/decision-authority.repository";
import { createPersonRepository } from "../../modules/person/person.factory";
import { PersonRepository } from "../../modules/person/person.repository";

// this class is used for transactional operations, 
// so we need to create new instances of repositories for each transaction
export function repositoryContainer(db: Database)
{
    let actor: ActorRepository | undefined;
    let organization: OrganizationRepository | undefined;
    let person: PersonRepository | undefined;

    let journal: JournalRepository | undefined;
    let journalAffiliation: JournalAffiliationRepository | undefined;

    let awardScheme: AwardSchemeRepository | undefined;
    let decisionAuthority: DecisionAuthorityRepository | undefined;
    let awardDecision: AwardDecisionRepository | undefined;

    let sourceDocument: SourceDocumentRepository | undefined;
    
    let importJob: ImportJobRepository | undefined;
    let importJobSourceDocument: ImportJobSourceDocumentRepository | undefined;

    return {
        get organization() {
            return organization ??= createOrganizationRepository(db.organization);
        },

        get journal() {
            return journal ??= createJournalRepository(db.journal);
        },

        get journalAffiliation() {
            return journalAffiliation ??= createJournalAffiliationRepository(db.journalAffiliation);
        },

        get awardScheme() {
            return awardScheme ??= createAwardSchemeRepository(db.awardScheme);
        },

        get decisionAuthority() {
            return decisionAuthority ??= createDecisionAuthorityRepository(db.decisionAuthority);
        },

        get sourceDocument() {
            return sourceDocument ??= createSourceDocumentRepository(db.sourceDocument);
        },

        get awardDecision() {
            return awardDecision ??= createAwardDecisionRepository(db.awardDecision);
        },

        get actor() {
            return actor ??= createActorRepository(db.actor);
        },

        get importJob() {
            return importJob ??= new ImportJobRepository(db.importJob);
        },

        get importJobSourceDocument() {
            return importJobSourceDocument ??= new ImportJobSourceDocumentRepository(db.importJobSourceDocument);
        },

        get person() {
            return person ??= createPersonRepository(db.person);
        }
    };
}