import { describe, it, expect } from "vitest";
import { OrganizationSchema } from "../../../src/modules/organization/validation/organization.schema";
import { LegalForm, Sector } from "@prisma/client";

describe('Organization schema test', () => {
    
        it('accepts valid organization', () => {
            const result = OrganizationSchema.safeParse({
                name: 'Tiszatáj',
                legalForm: LegalForm.FOUNDATION,
                sector: Sector.CIVIL,
            });

            expect(result.success).toBe(true);
        });

        it('rejects empty name', () => {
            const result = OrganizationSchema.safeParse({
                name: '',
                legalForm: 'LTD',
            });

            expect(result.success).toBe(false);
        });

        it('rejects invalid legal form', () => {
            const result = OrganizationSchema.safeParse({
                name: 'Tiszatáj',
                legalForm: 'INVALID'
            });
        });

        it('rejects invalid sector', () => {
            const result = OrganizationSchema.safeParse({
                name: 'Tiszatáj',
                sector: 'INVALID'
            });
        });

});
