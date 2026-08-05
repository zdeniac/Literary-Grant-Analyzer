import { DecisionAuthorityImportWriter } from "../../decision-authority/import/decision-authority.writer";
import { JournalImportWriter } from "../../journal/import/journal.writer";
import { OrganizationImportWriter } from "../../organization/import/organization.writer";
import { ImportWriter } from "../handler/import-writer";
import { ImportWriterRegistry } from "../registry/import-writer.registry";
import { ImportRepositoryRegistry } from "../registry/import-repository.registry";

export const createImportWriterRegistry = (repos: ImportRepositoryRegistry) => (
    new ImportWriterRegistry([
        [
            'journal', 
            new JournalImportWriter()
        ],
        [
            'organization', 
            new OrganizationImportWriter()
        ],
        [
            'awardScheme', 
            new ImportWriter(repos.getOrThrow('awardScheme'))
        ],
        [
            'decisionAuthority',
            new DecisionAuthorityImportWriter()
        ],
        [
            'awardDecision', 
            new ImportWriter(repos.getOrThrow('awardDecision'))
        ],
    ])
);