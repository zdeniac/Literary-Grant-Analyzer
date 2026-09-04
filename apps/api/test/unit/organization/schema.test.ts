import { LegalForm, Sector } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
    createOrganizationSchema,
    importOrganizationSchema,
    organizationSchema,
    updateOrganizationSchema,
} from "../../../src/modules/organization/validation/organization.schema";

const validOrganization = {
    id: 1,
    name: 'Tiszatáj',
    nameVariants: ['tiszataj'],
    legalForm: LegalForm.FOUNDATION,
    sector: Sector.CIVIL,
    address: '123 Main St',
    website: 'https://example.org',
    foundingYear: 2020,
    actorId: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('Organization schema test', () => {
    it('accepts a valid organization payload', () => {
        const parsed = organizationSchema.parse(validOrganization);

        expect(parsed).toEqual({
            ...validOrganization,
            createdAt: new Date(validOrganization.createdAt),
            updatedAt: new Date(validOrganization.updatedAt),
        });
    });

    it('rejects an empty name', () => {
        expect(() =>
            organizationSchema.parse({
                ...validOrganization,
                name: '',
            })
        ).toThrow();
    });

    it('rejects an invalid legal form', () => {
        expect(() =>
            organizationSchema.parse({
                ...validOrganization,
                legalForm: 'INVALID' as LegalForm,
            })
        ).toThrow();
    });

    it('accepts a create payload without id and timestamps', () => {
        const parsed = createOrganizationSchema.parse({
            name: 'Tiszatáj',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: '',
            website: '',
            foundingYear: 2020,
        });

        expect(parsed).toEqual({
            name: 'Tiszatáj',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: undefined,
            website: undefined,
            foundingYear: 2020,
        });
    });

    it('allows partial updates', () => {
        const parsed = updateOrganizationSchema.parse({
            name: 'Updated organization',
        });

        expect(parsed).toEqual({
            name: 'Updated organization',
        });
    });

    it('accepts import payloads with the create schema shape', () => {
        const parsed = importOrganizationSchema.parse({
            name: 'Imported organization',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
        });

        expect(parsed).toEqual({
            name: 'Imported organization',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: undefined,
            website: undefined,
            foundingYear: undefined,
        });
    });
});
