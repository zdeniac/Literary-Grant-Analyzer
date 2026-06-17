import { describe, it, expect } from "vitest";
import { JournalStatus } from "@prisma/client";
import { JournalSchema } from "../../../src/modules/journal/validate/journal.schema";

describe('Organization schema test', () => {
    
        it('accepts valid organization', () => {
            const result = JournalSchema.safeParse({
                name: 'Alföld',
                status: JournalStatus.ACTIVE,
                organizationId: 1,
            });

            expect(result.success).toBe(true);
        });

        it('rejects empty name', () => {
            const result = JournalSchema.safeParse({
                name: '',
                status: 'ACTIVE',
                organizationId: 1,
            });

            expect(result.success).toBe(false);
        });

        it('rejects invalid status', () => {
            const result = JournalSchema.safeParse({
                name: 'Alföld',
                status: 'BRR',
                organizationId: 1,
            });

            expect(result.success).toBe(false);
        });

        it('rejects empty organization id', () => {
            const result = JournalSchema.safeParse({
                name: 'Alföld',
                status: JournalStatus.ACTIVE,
                organizationId: null,
            });

            expect(result.success).toBe(false);
        });
});
