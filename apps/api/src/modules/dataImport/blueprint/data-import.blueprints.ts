import { ImportJournalSchema } from "../../journal/validate/journal.schema";
import { OrganizationSchema } from "../../organization/validation/organization.schema";
import { ModelBlueprint, RelationalBlueprint } from "./../types/data-import.types";

export const dataImporterBlueprints: Record<string, ModelBlueprint | RelationalBlueprint> = {
    organization: {
        fields: Object.keys(OrganizationSchema.shape),
        schema: OrganizationSchema,
    },

    journal: {
        fields: Object.keys(ImportJournalSchema.shape),
        schema: ImportJournalSchema,
        relation: {
            repository: 'organization',

            sourceField: 'organizationName',
            lookupField: 'name',

            foreignKey: 'organizationId',
            targetField: 'id',
        },
    }
};