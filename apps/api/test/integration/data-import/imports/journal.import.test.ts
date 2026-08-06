import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { JournalStatus, LegalForm, Sector } from "@prisma/client";
import { ImportFile } from "../../../../src/modules/data-import/types/import.types";
import { ImportValidationError } from "../../../../src/modules/data-import/error/import.errors";
import { prisma } from "../../../../src/db/prisma";
import { wipeDatabase } from "../../helpers/db.helper";
import { createOrganization } from "../../helpers/factories/organization.factory";
import { createImportModule } from "../../../../src/modules/data-import/factory/import.factory";
import { createImportFile, expectFinishedImportJobWithStatus } from "../helpers/import.helpers";

describe('Journal Import Service', () => {
    const importer = createImportModule().service;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('imports journals correctly', async () => {
        const org1 = await createOrganization({
            name: 'Jelenkor Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Pécs',
            foundingYear: 1990,
        });

        const org2 = await createOrganization({
            name: 'Alföld Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Szeged',
            foundingYear: 1989,
        });

        const journalFile: ImportFile = createImportFile(
            'journal_import.csv',
            [
                {
                    name: 'Alföld',
                    issn: '2049-3610',
                    status: JournalStatus.ACTIVE,
                    foundingYear: 1989,
                    format: 'ONLINE|PRINT',
                    organizationNames: `${org1.name}|${org2.name}`,
                },
            ]
        );

        const importJob = await importer.import('journal', journalFile);

        expectFinishedImportJobWithStatus(importJob, {
            fileName: journalFile.fileName,
            mimeType: journalFile.mimeType,
            totalRows: 1,
            importedRows: 1,
        });

        const journal = await prisma.journal.findUnique({
            where: { issn: '20493610' },
            include: {
                affiliations: {
                    include: { organization: true }
                }
            }
        });

        expect(journal).not.toBeNull();
        expect(journal?.affiliations.length).toBe(2);
        expect(journal?.affiliations.map(a => a.organization.name)).toEqual(
            expect.arrayContaining([org1.name, org2.name])
        );
    });

    it('throws when referenced journal organizations do not exist', async () => {
        const journalFile: ImportFile = createImportFile(
            'journal_import.csv',
            [
                {
                    name: 'Alföld',
                    issn: '2049-3610',
                    status: JournalStatus.ACTIVE,
                    foundingYear: 1989,
                    format: 'ONLINE|PRINT',
                    organizationNames: 'Unknown Org',
                },
            ]
        );
        
        await expect(
            importer.import('journal', journalFile)
        ).rejects.toThrow(ImportValidationError);
    });

    it('throws on invalid journal row data', async () => {
        const org = await createOrganization({
            name: 'Jelenkor Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Pécs',
            foundingYear: 1990,
        });

        const invalidJournalFile: ImportFile = createImportFile(
            'journal_import.csv',
            [
                {
                    name: 'Alföld',
                    issn: '2049-3610',
                    status: 'UNKNOWN_STATUS',
                    foundingYear: 1989,
                    format: 'ONLINE|PRINT',
                    organizationNames: org.name,
                },
            ],
        );

        await expect(
            importer.import('journal', invalidJournalFile)
        ).rejects.toThrow(ImportValidationError);
    });
});
