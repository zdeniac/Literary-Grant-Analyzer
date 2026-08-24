import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { AwardSchemeType, FundingArea, ImportJobStatus, LegalForm, Sector } from "@prisma/client";
import { ImportFile } from "../../../../src/modules/data-import/types/import.types";
import { ImportDataValidationError } from "../../../../src/modules/data-import/error/import.errors";
import { prisma } from "../../../../src/db/prisma";
import { wipeDatabase } from "../../helpers/db.helper";
import { createOrganization } from "../../helpers/factories/organization.factory";
import { createImportModule } from "../../../../src/modules/data-import/factory/import.factory";
import { createImportFile, expectFinishedImportJobWithStatus } from "../helpers/import.helpers";

describe('AwardScheme Import Service', () => {
    const importer = createImportModule().service;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('imports award schemes correctly', async () => {
        const organization = await createOrganization({
            name: 'Alföld Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Szeged',
            foundingYear: 1989,
        });

        const awardSchemeFile: ImportFile = createImportFile(
            'award_scheme_import.csv',
            [
                {
                    name: 'Irodalmi támogatás',
                    type: AwardSchemeType.GRANT,
                    fundingArea: FundingArea.CREATIVE_WORK,
                    organizationName: organization.name,
                },
            ]
        );
        
        const importJob = await importer.import('awardScheme', awardSchemeFile);

        expectFinishedImportJobWithStatus(importJob, {
            fileName: awardSchemeFile.fileName,
            mimeType: awardSchemeFile.mimeType,
            totalRows: 1,
            importedRows: 1,
        });

        const awardScheme = await prisma.awardScheme.findFirst({
            where: { name: 'Irodalmi támogatás' },
            include: { organization: true },
        });

        expect(awardScheme).not.toBeNull();
        expect(awardScheme).toMatchObject({
            name: 'Irodalmi támogatás',
            type: AwardSchemeType.GRANT,
            fundingArea: FundingArea.CREATIVE_WORK,
            organization: {
                name: organization.name,
            },
        });

        expect(awardScheme).toHaveProperty('organizationId');
    });

    it('throws when referenced organization does not exist', async () => {
        const awardSchemeFile: ImportFile = createImportFile(
            'award_scheme_import.csv',
            [
                {
                    name: 'Irodalmi támogatás',
                    type: AwardSchemeType.GRANT,
                    organizationName: 'Unknown Organization',
                    fundingArea: FundingArea.CREATIVE_WORK,
                },
            ]
        );

        await expect(
            importer.import('awardScheme', awardSchemeFile)
        ).rejects.toThrow(ImportDataValidationError);
    });

    it('throws on invalid award scheme row data', async () => {
        const organization = await createOrganization({
            name: 'Alföld Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Szeged',
            foundingYear: 1989,
        });

        const invalidAwardSchemeFile: ImportFile = createImportFile(
            'award_scheme_import.csv',
            [
                {
                    name: 'Invalid Scheme',
                    type: 'UNKNOWN_TYPE',
                    fundingArea: FundingArea.RECOGNITION,
                    organizationName: organization.name,
                },
            ]
        );

        await expect(
            importer.import('awardScheme', invalidAwardSchemeFile)
        ).rejects.toThrow(ImportDataValidationError);
    });
});
