import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { ImportFile } from "../../../src/modules/data-import/types/import.types";
import { ImportValidationError } from "../../../src/modules/data-import/error/import.errors";
import { LegalForm, Sector } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { wipeDatabase } from "../helpers/db.helper";
import { createImportModule } from "../../../src/modules/data-import/factory/import.factory";

describe('Organization Import Service', () => {
    const importer = createImportModule().service;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('imports organizations correctly', async () => {
        const orgFile: ImportFile = {
            fileName: 'organization_import.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'legalForm',
                'address',
                'website',
                'sector',
                'foundingYear',
            ],
            rows: [
                {
                    name: 'Jelenkor Alapítvány',
                    legalForm: LegalForm.FOUNDATION,
                    address: 'Pécs',
                    website: 'https://www.jelenkor.net/',
                    sector: Sector.CIVIL,
                    foundingYear: 1990,
                },
                {
                    name: 'Alföld Alapítvány',
                    legalForm: LegalForm.FOUNDATION,
                    address: 'Szeged',
                    website: 'https://alfoldonline.hu/',
                    sector: Sector.CIVIL,
                    foundingYear: 1989,
                },
            ],
        };

        const imported = await importer.import('organization', orgFile);

        expect(imported).toBe(2);

        const organization = await prisma.organization.findUnique({
            where: { name: 'Jelenkor Alapítvány' }
        });

        expect(organization).toMatchObject({
            name: 'Jelenkor Alapítvány',
            address: 'Pécs',
            legalForm: LegalForm.FOUNDATION,
            foundingYear: 1990,
        });

        expect(organization).toHaveProperty('id');
        expect(organization).toHaveProperty('createdAt');
    });

    it('throws on invalid organization row data', async () => {
        const invalidOrgFile: ImportFile = {
            fileName: 'organization_import.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'legalForm',
                'address',
                'website',
                'sector',
                'foundingYear',
            ],
            rows: [
                {
                    name: 'Invalid Org',
                    legalForm: LegalForm.FOUNDATION,
                    address: 'Budapest',
                    website: 'https://invalid.hu/',
                    sector: Sector.CIVIL,
                    foundingYear: 'not-a-number',
                },
            ],
        };

        await expect(
            importer.import('organization', invalidOrgFile)
        ).rejects.toThrow(ImportValidationError);
    });
});
