import { ModelBlueprint, RelationalBlueprint } from "./../types/data-import.types";
import { organizationBlueprint } from "./organization.blueprint";
import { journalBlueprint } from "./journal.blueprint";

export const dataImporterBlueprints: Record<string, ModelBlueprint | RelationalBlueprint> = {
    organization: organizationBlueprint,
    journal: journalBlueprint
};
