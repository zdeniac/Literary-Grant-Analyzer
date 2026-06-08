import { describe, it, expect } from "vitest";
import { organizationSchema } from "../../../src/modules/organization/validation/organization.schema";
import { LegalForm } from "@prisma/client";

describe('organizationSchema', () => {
    
        it('accepts valid organization', () => {
            const result = organizationSchema.safeParse({
                name: 'Tiszatáj',
                legalForm: LegalForm.FOUNDATION,
            });

            expect(result.success).toBe(true);
        });

        it('rejects empty name', () => {
            const result = organizationSchema.safeParse({
                name: '',
                legalForm: 'LTD',
            });

            expect(result.success).toBe(false);
        });

        it('rejects invalid legal form', () => {
            const result = organizationSchema.safeParse({
                name: 'Tiszatáj',
                legalForm: 'INVALID'
            });
        });
});
