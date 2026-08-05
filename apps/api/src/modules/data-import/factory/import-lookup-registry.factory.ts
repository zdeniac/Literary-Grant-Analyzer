import { ImportLookup } from "../handler/import-lookup";
import { ImportLookupRegistry } from "../registry/import-lookup.registry";
import { ImportRepositoryRegistry } from "../registry/import-repository.registry";
import { orgNameLookupConfig } from "./lookup-configs.factory";

export const createImportLookupRegistry = (repos: ImportRepositoryRegistry) => (
    new ImportLookupRegistry([
        [
            'journal', 
            new ImportLookup(repos.getOrThrow('journal'), 
            orgNameLookupConfig
        )],
        [
            'organization', 
            new ImportLookup(repos.getOrThrow('organization'))
        ],
        [
            'awardScheme', 
            new ImportLookup(repos.getOrThrow('awardScheme'))
        ],
        [
            'decisionAuthority', 
            new ImportLookup(repos.getOrThrow('decisionAuthority'))
        ],
        [
            'awardDecision', 
            new ImportLookup(repos.getOrThrow('awardDecision'))
        ],
        [
            'sourceDocument', 
            new ImportLookup(repos.getOrThrow('sourceDocument'))
        ]

    ])
);
