import { JournalFormat, JournalStatus } from "@prisma/client";
import { importJournalSchema } from "../../journal/validate/journal.schema";
import { RelationalModelBlueprint } from "../../data-import/types/import.types";

export const journalBlueprint: RelationalModelBlueprint = 
    {
        model: 'journal',
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
                name: 'organizationName',
                type: 'string',
                required: true
            },
        ],
        schema: importJournalSchema,
        relations: [
            {
                model: 'organization',

                sourceField: 'organizationName',
                lookupField: 'name',

                foreignKey: 'organizationId',
                targetField: 'id',
            },
        ],
    };