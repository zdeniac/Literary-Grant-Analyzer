import { DecisionBodyImportWriter } from "../../decision-body/import/decision-body.writer";
import { JournalImportWriter } from "../../journal/import/journal.writer";
import { OrganizationImportWriter } from "../../organization/import/organization.writer";
import { ImportWriter } from "../handler/writer";
import { createImportRepositories } from "./repositories.factory";

export const createImportWriters = (repos: ReturnType<typeof createImportRepositories>) => ({
    journal: new JournalImportWriter(),
    organization: new OrganizationImportWriter(),
    awardScheme: new ImportWriter(repos.awardScheme),
    decisionBody: new DecisionBodyImportWriter(),
});