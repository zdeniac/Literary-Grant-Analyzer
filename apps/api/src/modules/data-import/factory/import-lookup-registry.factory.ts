import { ImportLookupRegistry } from "../registry/import-lookup.registry";
import { ImportRepositoryRegistry } from "../registry/import-repository.registry";
import { createImportLookup } from "./import-lookup.factory";
import { awardSchemeLookupConfig, decisionAuthorityLookupConfig, organizationLookupConfig, sourceDocumentLookupConfig } from "./lookup-configs.factory";

export const createImportLookupRegistry = (repos: ImportRepositoryRegistry) => (
    new ImportLookupRegistry([
        [
            'journal', 
            createImportLookup('journal', repos), 
        ],
        [
            'organization',
            createImportLookup('organization', repos, organizationLookupConfig), 
        ],
        [
            'awardScheme',
            createImportLookup('awardScheme', repos, awardSchemeLookupConfig), 
        ],
        [
            'decisionAuthority',
            createImportLookup('decisionAuthority', repos, decisionAuthorityLookupConfig), 
        ],
        [
            'awardDecision',
            createImportLookup('awardDecision', repos), 
        ],
        [
            'sourceDocument',
            createImportLookup('sourceDocument', repos, sourceDocumentLookupConfig), 
        ]

    ])
);
