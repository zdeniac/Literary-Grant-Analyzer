import { JournalFormat, JournalStatus } from "@prisma/client";
import { importJournalSchema } from "../../journal/validate/journal.schema";
import { RelationalEntityBlueprint } from "../../data-import/types/import.types";

export const journalBlueprint: RelationalEntityBlueprint = 
    {
        entity: 'journal',
        fields: [
            {
                name: 'name',
                type: 'string',
                required: true,
            },
            {
                name: 'issn',
                type: 'string',
                required: false,
            },
            {
                name: 'foundingYear',
                type: 'number',
                required: false,
            },
            {
                name: 'status',
                type: 'enum',
                required: true,
                options: Object.keys(JournalStatus)
            },
            {
                name: 'format',
                type: 'array[enum]',
                required: true,
                options: Object.keys(JournalFormat)
            },
            {
                name: 'organizationNames',
                type: 'array[string]',
                required: true
            },
        ],
        schema: importJournalSchema,
        relations: [
            {
                entity: 'organization',
                lookup: {
                    sourceField: 'organizationNames',
                    lookupField: 'name',
                },
                foreignKey: 'organizationIds',
                targetField: 'id',
                multiple: true,
            },
        ],
    };