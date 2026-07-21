import { describe, it, expect } from "vitest";
import { organizationSchema } from "../../../src/modules/organization/validation/organization.schema";
import { LegalForm, Sector } from "@prisma/client";

describe('Organization schema test', () => {
    
        it('accepts valid organization', () => {
            const result = organizationSchema.safeParse({
                name: 'Tiszatáj',
                legalForm: LegalForm.FOUNDATION,
                sector: Sector.CIVIL,
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

        it('rejects invalid sector', () => {
            const result = organizationSchema.safeParse({
                name: 'Tiszatáj',
                sector: 'INVALID'
            });
        });

});
