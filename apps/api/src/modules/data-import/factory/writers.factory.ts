import { DecisionAuthorityImportWriter } from "../../decision-authority/import/decision-authority.writer";
import { JournalImportWriter } from "../../journal/import/journal.writer";
import { OrganizationImportWriter } from "../../organization/import/organization.writer";
import { ImportWriter } from "../handler/writer";
import { createImportRepositories } from "./repositories.factory";

export const createImportWriters = (repos: ReturnType<typeof createImportRepositories>) => ({
    journal: new JournalImportWriter(),

    organization: new OrganizationImportWriter(),

    awardScheme: new ImportWriter(repos.awardScheme),

    decisionAuthority: new DecisionAuthorityImportWriter(),

    awardDecision: new ImportWriter(repos.awardDecision),
});