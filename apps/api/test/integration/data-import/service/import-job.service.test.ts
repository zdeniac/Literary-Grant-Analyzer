import { afterAll, describe, expect, it } from "vitest";
import { ImportEmptyFileError, ImportDataValidationError } from "../../../../src/modules/data-import/error/import.errors";
import { createImportFile } from "../helpers/import.helpers";
import { prisma } from "../../../../src/db/prisma";
import { AwardSchemeType, FundingArea, ImportJobStatus, LegalForm, Sector } from "@prisma/client";
import { beforeEach } from "node:test";
import { wipeDatabase } from "../../helpers/db.helper";
import { createImportModule } from "../../../../src/modules/data-import/factory/import.factory";
import { CreateOrganizationInput } from "../../../../src/modules/organization/dto/organization.input.dto";
import { ImportFile } from "../../../../src/modules/data-import/types/import.types";

describe('ImportJob failure handling', () => {
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

    
    it('creates failed import job for every import error', async () => {
        const cases = [
            {
                name: 'empty file',
                entity: 'organization' as const,
                file: {
                    fileName: 'empty.csv',
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
                },
                error: ImportEmptyFileError,
                expected: {
                    totalRows: 0,
                    failedRows: 0,
                }
            },
            {
                name: 'invalid row data',
                entity: 'organization' as const,
                file: createImportFile(
                    'invalid-row.csv',
                    [
                        {
                            ...org1,
                            foundingYear: 'invalid'
                        }
                    ]
                ),
                error: ImportDataValidationError,
                expected: {
                    totalRows: 1,
                    failedRows: 1,
                }
            },
            {
                name: 'unknown header',
                entity: 'organization' as const,
                file: {
                    fileName: 'invalid-header.csv',
                    mimeType: 'text/csv',
                    header: [
                        'unknownField'
                    ],
                    rows: [
                        {
                            unknownField: 'test'
                        }
                    ],
                },
                error: ImportDataValidationError,
                expected: {
                    totalRows: 1,
                    failedRows: 1,
                }
            },
            {
                name: 'missing relation',
                entity: 'awardScheme' as const,
                file: awardSchemeFile,
                error: Error,
                expected: {
                    totalRows: 1,
                    failedRows: 1,
                }
            }
        ];

        for (const testCase of cases) {
            await expect(
                importer.import(testCase.entity, testCase.file)
            )
                .rejects
                .toThrow(testCase.error);


            const importJob = await prisma.importJob.findFirst({
                where: {
                    fileName: testCase.file.fileName,
                },
                orderBy: {
                    id: 'desc',
                },
            });

            expect(importJob, testCase.name)
                .not
                .toBeNull();

            expect(importJob).toMatchObject({
                fileName: testCase.file.fileName,
                mimeType: testCase.file.mimeType,
                totalRows: testCase.expected.totalRows,
                importedRows: 0,
                failedRows: testCase.expected.failedRows,
                status: ImportJobStatus.FAILED,
            });

            expect(importJob?.startedAt)
                .not
                .toBeNull();

            expect(importJob?.finishedAt)
                .not
                .toBeNull();

            expect(importJob?.errorMessage)
                .not
                .toBeNull();
        }
    });
});
