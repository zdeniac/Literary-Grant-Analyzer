import { JournalFormat, JournalStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
    createJournalSchema,
    importJournalSchema,
    journalSchema,
    updateJournalWithAffiliationsSchema,
} from "../../../src/modules/journal/validate/journal.schema";

const validJournal = {
    id: 1,
    name: 'Alföld',
    issn: '1234-5678',
    foundingYear: 2020,
    status: JournalStatus.ACTIVE,
    format: [JournalFormat.ONLINE],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('Journal schema test', () => {
    it('accepts a valid journal payload', () => {
        const parsed = journalSchema.parse(validJournal);

        expect(parsed).toEqual({
            ...validJournal,
            issn: '12345678',
            createdAt: new Date(validJournal.createdAt),
            updatedAt: new Date(validJournal.updatedAt),
        });
    });

    it('rejects an empty name', () => {
        expect(() =>
            journalSchema.parse({
                ...validJournal,
                name: '',
            })
        ).toThrow();
    });

    it('accepts a create payload without id and timestamps', () => {
        const parsed = createJournalSchema.parse({
            name: 'Alföld',
            issn: '12345678',
            foundingYear: 2020,
            status: JournalStatus.ACTIVE,
            format: [JournalFormat.ONLINE],
        });

        expect(parsed).toEqual({
            name: 'Alföld',
            issn: '12345678',
            foundingYear: 2020,
            status: JournalStatus.ACTIVE,
            format: [JournalFormat.ONLINE],
        });
    });

    it('allows partial updates', () => {
        const parsed = updateJournalWithAffiliationsSchema.parse({
            name: 'Updated journal',
        });

        expect(parsed).toEqual({
            name: 'Updated journal',
            status: JournalStatus.ACTIVE,
        });
    });

    it('accepts import payloads with organizationName', () => {
        const parsed = importJournalSchema.parse({
            name: 'Imported journal',
            format: [JournalFormat.PRINT],
            organizationName: 'Example Org',
        });

        expect(parsed).toEqual({
            name: 'Imported journal',
            format: [JournalFormat.PRINT],
            organizationName: 'Example Org',
            issn: undefined,
            foundingYear: undefined,
            status: JournalStatus.ACTIVE,
        });
    });
});
