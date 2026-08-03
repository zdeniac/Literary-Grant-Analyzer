import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { LegalForm, Sector } from "@prisma/client";
import { ImportFile } from "../../../src/modules/data-import/types/import.types";
import { ImportValidationError } from "../../../src/modules/data-import/error/import.errors";
import { prisma } from "../../../src/db/prisma";
import { wipeDatabase } from "../helpers/db.helper";
import { createOrganization } from "../helpers/factories/organization.factory";
import { createImportModule } from "../../../src/modules/data-import/factory/import.factory";

describe('DecisionBody Import Service', () => {
    const importer = createImportModule().service;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('imports decision bodies correctly', async () => {
        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const decisionBodyFile: ImportFile = {
            fileName: 'decision_body_import.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'organizationName',
            ],
            rows: [
                {
                    name: 'Szépirodalom Kollégium',
                    organizationName: decisionOrganization.name,
                },
            ],
        };

        const imported = await importer.import('decisionBody', decisionBodyFile);

        expect(imported).toBe(1);

        const decisionBody = await prisma.decisionBody.findFirst({
            where: { name: 'Szépirodalom Kollégium' },
            include: { organization: true },
        });

        expect(decisionBody).not.toBeNull();
        expect(decisionBody).toMatchObject({
            name: 'Szépirodalom Kollégium',
            organization: {
                name: decisionOrganization.name,
            },
        });
    });

    it('throws when referenced organization does not exist', async () => {
        const decisionBodyFile: ImportFile = {
            fileName: 'decision_body_import.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'organizationName',
            ],
            rows: [
                {
                    name: 'Szépirodalom Kollégium',
                    organizationName: 'Unknown Organization',
                },
            ],
        };

        await expect(
            importer.import('decisionBody', decisionBodyFile)
        ).rejects.toThrow(ImportValidationError);
    });

    it('throws on invalid decision body row data', async () => {
        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const invalidDecisionBodyFile: ImportFile = {
            fileName: 'decision_body_import.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'organizationName',
            ],
            rows: [
                {
                    name: '',
                    organizationName: decisionOrganization.name,
                },
            ],
        };

        await expect(
            importer.import('decisionBody', invalidDecisionBodyFile)
        ).rejects.toThrow(ImportValidationError);
    });
});
