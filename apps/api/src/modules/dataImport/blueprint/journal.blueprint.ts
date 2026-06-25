import { JournalStatus } from "@prisma/client";
import { ImportJournalSchema } from "../../journal/validate/journal.schema";
import { RelationalBlueprint } from "../types/data-import.types";

export const journalBlueprint: RelationalBlueprint = 
    {
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
                required: true,
            },
            {
                name: 'status',
                type: 'string',
                required: false,
                options: Object.keys(JournalStatus)
            },
            {
                name: 'organizationName',
                type: 'string',
                required: true
            },
        ],
        schema: ImportJournalSchema,
        relation: {
            repository: 'organization',

            sourceField: 'organizationName',
            lookupField: 'name',

            foreignKey: 'organizationId',
            targetField: 'id',
        },
    };