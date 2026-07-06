import { JournalStatus } from "@prisma/client";
import { ImportJournalSchema } from "../../journal/validate/journal.schema";
import { RelationalModelBlueprint } from "../types/import.types";

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