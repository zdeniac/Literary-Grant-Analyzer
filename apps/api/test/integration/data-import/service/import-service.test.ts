import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { ImportFile } from "../../../../src/modules/data-import/types/import.types";
import { 
    JournalStatus, 
    LegalForm, 
    Sector,
    AwardSchemeType,
    ImportJobStatus,
    FundingArea,
} from "@prisma/client";
import { ImportEmptyFileError, ImportError, ImportDataValidationError } from "../../../../src/modules/data-import/error/import.errors";
import { prisma } from "../../../../src/db/prisma";
import { wipeDatabase } from "../../helpers/db.helper";
import { createOrganization } from "../../helpers/factories/organization.factory";
import { createImportModule } from "../../../../src/modules/data-import/factory/import.factory";
import { CreateOrganizationInput } from "../../../../src/modules/organization/dto/organization.input.dto";
import { createImportFile, expectFinishedImportJobWithStatus } from "../helpers/import.helpers";

describe('Data Import Service test', () => {
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const importer = createImportModule().service;

    const org1: CreateOrganizationInput = {
        name: 'Jelenkor Alapítvány',
        legalForm: LegalForm.FOUNDATION,
        address: 'Pécs',
        sector: Sector.CIVIL,
        foundingYear: 1990,
        website: 'https://www.jelenkor.net/',

    };

    const org2: CreateOrganizationInput = {
        name: 'Alföld Alapítvány',
        legalForm: LegalForm.FOUNDATION,
        address: 'Szeged',
        sector: Sector.CIVIL,
        foundingYear: 1989,
        website: 'https://alfoldonline.hu/'
    };

    const orgFile: ImportFile = createImportFile(
        'organizations_import.csv',
        [
            org1, 
            org2
        ],
    );

    const awardSchemeFile: ImportFile = createImportFile(
        'award_scheme_import.csv',
        [
            {
                name: 'Irodalmi laptámogatás',
                type: AwardSchemeType.GRANT,
                fundingArea: FundingArea.PERIODICAL,
                organizationName: 'Alföld Alapítvány',
            }
        ]
    );
    
    const journalFile: ImportFile = createImportFile(
        'journal_import.csv',
        [
            {
                name: 'Alföld',
                issn: '2049-3610',
                status: JournalStatus.ACTIVE,
                format: 'ONLINE|PRINT',
                foundingYear: 1989,
                organizationNames: org1.name + '|' + org2.name,
            },
        ]
    );

    it('imports data on entity without relation', async() => {
        const importJob = await importer.import(
            'organization',
            orgFile
        );

        expectFinishedImportJobWithStatus(importJob, {
            fileName: orgFile.fileName,
            mimeType: orgFile.mimeType,
            totalRows: 2,
            importedRows: 2,
        });
    });

    it('imports data with N:1 relation (award scheme -> organization)', async() => {
        const org = await createOrganization(org2);

        const importJob1 = await importer.import(
            'awardScheme',
            awardSchemeFile
        );

        expect(importJob1.totalRows).toBe(1);
        expect(importJob1.importedRows).toBe(1);
        expect(importJob1.failedRows).toBe(0);
        expect(importJob1.status).toBe(ImportJobStatus.COMPLETED);

        const awardScheme = await prisma.awardScheme.findMany({
            where: {
                name: 'Irodalmi laptámogatás'
            },
            include: {
                organization: true,
            }
        });

        expect(awardScheme.length).toBe(1);
        expect(awardScheme[0].organizationId).toBe(org.id);
    });

    it('imports data with N:M relation (journal -> organizations)', async() => {
        const orgRelation1 = await createOrganization(org1);
        const orgRelation2 = await createOrganization(org2);

        const importJob = await importer.import(
            'journal',
            journalFile
        );

        expect(importJob.totalRows).toBe(1);
        expect(importJob.importedRows).toBe(1);
        expect(importJob.failedRows).toBe(0);
        expect(importJob.status).toBe(ImportJobStatus.COMPLETED);

        const journal = await prisma.journal.findUnique({
            where: {
                issn: '20493610'
            },
            include: {
                affiliations: {
                    include: {
                        organization: true
                    }
                }
            }
        });

        expect(journal).not.toBeNull();

        expect(journal?.affiliations.length)
            .toBe(2);

        expect(
            journal?.affiliations.map(
                affiliation => affiliation.organization.id
            )
        )
        .toEqual(
            expect.arrayContaining([
                orgRelation1.id,
                orgRelation2.id,
            ])
        );
    });

    it('throws on unknown header', async () => {
        await expect(
            importer.import(
                'organization',
                {
                    fileName: 'organizations_import.csv',
                    mimeType: 'text/csv',
                    header: ['invalidField'],
                    rows: [],
                }
            )
        ).rejects.toThrow(ImportDataValidationError);
    });

    it('throws when an import file has no rows', async () => {
        const missingRowsFile: ImportFile = {
            fileName: 'organizations_import.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'legalForm',
                'address',
                'website',
                'sector',
                'foundingYear',
            ],
            rows: [],
        };

        await expect(
            importer.import('organization', missingRowsFile)
        ).rejects.toThrow(ImportEmptyFileError);

        const importJob = await prisma.importJob.findFirst({
            where: { model: 'organization', fileName: 'organizations_import.csv' },
            orderBy: { id: 'desc' },
        });

        expect(importJob).not.toBeNull();
        expect(importJob?.status).toBe(ImportJobStatus.FAILED);
        expect(importJob?.totalRows).toBe(0);
        expect(importJob?.failedRows).toBe(0);
        expect(importJob?.errorMessage).toContain('Missing rows for organization.');
    });

    it('throws when a row is empty', async () => {
        const emptyRowFile: ImportFile = {
            fileName: 'organizations_import.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'legalForm',
                'address',
                'website',
                'sector',
                'foundingYear',
            ],
            rows: [{}],
        };

        await expect(
            importer.import('organization', emptyRowFile)
        ).rejects.toThrow(ImportDataValidationError);

        const importJob = await prisma.importJob.findFirst({
            where: { model: 'organization', fileName: 'organizations_import.csv' },
            orderBy: { id: 'desc' },
        });

        expect(importJob).not.toBeNull();
        expect(importJob?.status).toBe(ImportJobStatus.FAILED);
        expect(importJob?.totalRows).toBe(1);
        expect(importJob?.failedRows).toBe(1);
        expect(importJob?.errorMessage).toContain('IMPORT_VALIDATION_ERROR');
    });

    it('throws when import entity is unknown', async () => {
        await expect(
            importer.import('unknownEntity' as any, orgFile)
        ).rejects.toThrow(ImportError);

        const importJob = await prisma.importJob.findFirst({
            where: { fileName: 'organizations_import.csv' },
            orderBy: { id: 'desc' },
        });

        expect(importJob).not.toBeNull();
        expect(importJob?.status).toBe(ImportJobStatus.FAILED);
        expect(importJob?.errorMessage).toContain('Unknown import entity');
    });

    it('throws on invalid row data and records failed rows', async () => {
        await expect(
            importer.import(
                'organization',
                {
                    ...orgFile,
                    rows: [
                        {
                            ...org1,
                            foundingYear: 'foo'
                        }
                    ]
                }
            )
        )
        .rejects
        .toThrow(ImportDataValidationError);

        const importJob = await prisma.importJob.findFirst({
            where: { model: 'organization', fileName: 'organizations_import.csv' },
            orderBy: { id: 'desc' },
        });

        expect(importJob).not.toBeNull();
        expect(importJob?.status).toBe(ImportJobStatus.FAILED);
        expect(importJob?.totalRows).toBe(1);
        expect(importJob?.failedRows).toBe(1);
        expect(importJob?.errorMessage).toContain('IMPORT_VALIDATION_ERROR');
    });

    it('throws when referenced foreign record does not exist', async () => {
        await expect(
            importer.import(
                'awardScheme',
                awardSchemeFile
            )
        ).rejects.toThrow(Error);
    });

    it('throws on invalid row data', async () => {
        await expect(
            importer.import(
                'organization',
                {
                    ...orgFile,
                    rows: [
                        {
                            ...org1,
                            foundingYear: 'foo'
                        }
                    ]
                }
            )
        )
        .rejects
        .toThrow(ImportDataValidationError);
    });
});