import { ImportLookup } from "../handler/lookup";
import { orgNameLookupConfig } from "./lookup-configs.factory";
import { createImportRepositories } from "./repositories.factory";

export const createImportLookups = (repos: ReturnType<typeof createImportRepositories>) => ({
    journal: new ImportLookup(repos.journal, orgNameLookupConfig),

    organization: new ImportLookup(repos.organization,),

    awardScheme: new ImportLookup(repos.awardScheme),
    
    decisionAuthority: new ImportLookup(repos.decisionAuthority),

    awardDecision: new ImportLookup(repos.awardDecision),
});