import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { LegalForm, Sector } from "@prisma/client";
import { ImportFile } from "../../../../src/modules/data-import/types/import.types";
import { ImportDataValidationError } from "../../../../src/modules/data-import/error/import.errors";
import { prisma } from "../../../../src/db/prisma";
import { wipeDatabase } from "../../helpers/db.helper";
import { createOrganization } from "../../helpers/factories/organization.factory";
import { createImportModule } from "../../../../src/modules/data-import/factory/import.factory";
import { createImportFile, expectFinishedImportJobWithStatus } from "../helpers/import.helpers";

describe('DecisionAuthority Import Service', () => {
    const importer = createImportModule().service;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('imports decision authorities correctly', async () => {
        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const decisionAuthorityFile: ImportFile = createImportFile(
            'decision_authority_import.csv',
            [
                {
                    name: 'Szépirodalom Kollégium',
                    organizationName: decisionOrganization.name,
                },
            ]
        );

        const imported = await importer.import('decisionAuthority', decisionAuthorityFile);

        expectFinishedImportJobWithStatus(imported, {
            fileName: decisionAuthorityFile.fileName,
            mimeType: decisionAuthorityFile.mimeType,
            totalRows: 1,
            importedRows: 1,
        });

        const decisionAuthority = await prisma.decisionAuthority.findFirst({
            where: { name: 'Szépirodalom Kollégium' },
            include: { organization: true },
        });

        expect(decisionAuthority).not.toBeNull();
        expect(decisionAuthority).toMatchObject({
            name: 'Szépirodalom Kollégium',
            organization: {
                name: decisionOrganization.name,
            },
        });
    });

    it('throws when referenced organization does not exist', async () => {
        const decisionAuthorityFile: ImportFile = createImportFile(
            'decision_authority_import.csv',
            [
                {
                    name: 'Szépirodalom Kollégium',
                    organizationName: 'Unknown Organization',
                },
            ],
        );

        await expect(
            importer.import('decisionAuthority', decisionAuthorityFile)
        ).rejects.toThrow(ImportDataValidationError);
    });

    it('throws on invalid decision body row data', async () => {
        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const invalidDecisionAuthorityFile: ImportFile = createImportFile(
            'decision_authority_import.csv',
            [
                {
                    name: '',
                    organizationName: decisionOrganization.name,
                },
            ],
        );

        await expect(
            importer.import('decisionAuthority', invalidDecisionAuthorityFile)
        ).rejects.toThrow(ImportDataValidationError);
    });
});
