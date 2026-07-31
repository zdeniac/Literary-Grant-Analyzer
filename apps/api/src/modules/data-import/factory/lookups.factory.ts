import { ImportLookup } from "../handler/lookup";
import { orgNameLookupConfig } from "./lookup-configs.factory";
import { createImportRepositories } from "./repositories.factory";

export const createImportLookups = (repos: ReturnType<typeof createImportRepositories>) => ({
    journal: new ImportLookup(repos.journal, orgNameLookupConfig),

    organization: new ImportLookup(repos.organization,),

    awardScheme: new ImportLookup(repos.awardScheme),
    
    decisionBody: new ImportLookup(repos.decisionBody),

    awardDecision: new ImportLookup(repos.awardDecision),
});