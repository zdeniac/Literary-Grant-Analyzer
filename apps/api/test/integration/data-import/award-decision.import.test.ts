import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { ImportFile } from "../../../src/modules/data-import/types/import.types";
import { ImportValidationError } from "../../../src/modules/data-import/error/import.errors";
import { LegalForm, Sector, AwardSchemeType } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { wipeDatabase } from "../helpers/db.helper";
import { createOrganization } from "../helpers/factories/organization.factory";
import { createImportModule } from "../../../src/modules/data-import/factory/import.factory";
import { createAwardScheme } from "../helpers/factories/award-scheme.factory";
import { createDecisionAuthority } from "../helpers/factories/decision-authority.factory";
import { createSourceDocument } from "../helpers/factories/source-document.factory";

describe('AwardDecision Import Service', () => {
    const importer = createImportModule().service;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('imports award decisions correctly', async () => {
        const organization = await createOrganization({
            name: 'Alföld Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Szeged',
            foundingYear: 1989,
        });

        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const decisionAuthority = await createDecisionAuthority({
            name: 'Szépirodalom Kollégium',
            organizationId: decisionOrganization.id,
        });

        const awardScheme = await createAwardScheme({
            name: 'Irodalmi támogatás',
            type: AwardSchemeType.GRANT,
            organizationId: decisionOrganization.id,
        });

        const sourceDocument = await createSourceDocument({});

        const awardDecisionFile: ImportFile = {
            fileName: 'award_decision_import.csv',
            mimeType: 'text/csv',
            header: [
                'recipientName',
                'awardSchemeName',
                'awardSchemeOrganizationName',
                'decisionMakerName',
                'amount',
                'purpose',
                'sourceIdentifier',
                'decisionDate',
                'sourceDocumentId',
            ],
            rows: [
                {
                    recipientName: organization.name,
                    awardSchemeName: awardScheme.name,
                    awardSchemeOrganizationName: decisionOrganization.name,
                    decisionMakerName: decisionAuthority.name,
                    amount: 500,
                    purpose: 'Folyóirat támogatás',
                    sourceIdentifier: 'NKA-2024-001',
                    decisionDate: new Date('2024-05-01'),
                    sourceDocumentId: sourceDocument.id,
                },
            ],
        };

        await importer.import('awardDecision', awardDecisionFile);

        const decision = await prisma.awardDecision.findFirst({
            where: {
                sourceIdentifier: 'NKA-2024-001',
            },
            include: {
                recipient: {
                    include: {
                        organization: true,
                    },
                },
                decisionMaker: {
                    include: {
                        decisionAuthority: true,
                    },
                },
                awardScheme: true,
                sourceDocument: true,
            },
        });

        expect(decision).not.toBeNull();
        expect(decision!.amount?.toNumber()).toBe(500);

        expect(decision).toMatchObject({
            purpose: 'Folyóirat támogatás',
            sourceIdentifier: 'NKA-2024-001',
            awardScheme: {
                id: awardScheme.id,
                name: 'Irodalmi támogatás',
            },
            recipient: {
                organization: {
                    id: organization.id,
                    name: 'Alföld Alapítvány',
                },
            },
            decisionMaker: {
                decisionAuthority: {
                    id: decisionAuthority.id,
                    name: 'Szépirodalom Kollégium',
                },
            },
            sourceDocument: {
                id: sourceDocument.id,
            },
        });
    });

    it('throws when referenced award decision foreign relations are missing', async () => {
        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const decisionAuthority = await createDecisionAuthority({
            name: 'Szépirodalom Kollégium',
            organizationId: decisionOrganization.id,
        });

        const sourceDocument = await createSourceDocument({});

        const awardDecisionFile: ImportFile = {
            fileName: 'award_decision_import.csv',
            mimeType: 'text/csv',
            header: [
                'recipientName',
                'awardSchemeName',
                'awardSchemeOrganizationName',
                'decisionMakerName',
                'amount',
                'purpose',
                'sourceIdentifier',
                'decisionDate',
                'sourceDocumentId',
            ],
            rows: [
                {
                    recipientName: 'Unknown Organization',
                    awardSchemeName: 'Irodalmi támogatás',
                    awardSchemeOrganizationName: decisionOrganization.name,
                    decisionMakerName: decisionAuthority.name,
                    amount: 500,
                    purpose: 'Folyóirat támogatás',
                    sourceIdentifier: 'NKA-2024-002',
                    decisionDate: new Date('2024-05-01'),
                    sourceDocumentId: sourceDocument.id,
                },
            ],
        };

        await expect(
            importer.import('awardDecision', awardDecisionFile)
        ).rejects.toThrow(ImportValidationError);
    });

    it('throws when award decision composite award scheme lookup cannot be resolved', async () => {
        const organization = await createOrganization({
            name: 'Alföld Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Szeged',
            foundingYear: 1989,
        });

        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const decisionAuthority = await createDecisionAuthority({
            name: 'Szépirodalom Kollégium',
            organizationId: decisionOrganization.id,
        });

        const awardScheme = await createAwardScheme({
            name: 'Irodalmi támogatás',
            type: AwardSchemeType.GRANT,
            organizationId: decisionOrganization.id,
        });

        const sourceDocument = await createSourceDocument({});

        const awardDecisionFile: ImportFile = {
            fileName: 'award_decision_import.csv',
            mimeType: 'text/csv',
            header: [
                'recipientName',
                'awardSchemeName',
                'awardSchemeOrganizationName',
                'decisionMakerName',
                'amount',
                'purpose',
                'sourceIdentifier',
                'decisionDate',
                'sourceDocumentId',
            ],
            rows: [
                {
                    recipientName: organization.name,
                    awardSchemeName: awardScheme.name,
                    awardSchemeOrganizationName: 'Wrong Organization',
                    decisionMakerName: decisionAuthority.name,
                    amount: 500,
                    purpose: 'Folyóirat támogatás',
                    sourceIdentifier: 'NKA-2024-004',
                    decisionDate: new Date('2024-05-01'),
                    sourceDocumentId: sourceDocument.id,
                },
            ],
        };

        await expect(
            importer.import('awardDecision', awardDecisionFile)
        ).rejects.toThrow(ImportValidationError);
    });

    it('throws on invalid award decision row data', async () => {
        const organization = await createOrganization({
            name: 'Alföld Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
            address: 'Szeged',
            foundingYear: 1989,
        });

        const decisionOrganization = await createOrganization({
            name: 'Nemzeti Kulturális Alap',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.PUBLIC,
            address: 'Budapest',
            foundingYear: 1993,
        });

        const decisionAuthority = await createDecisionAuthority({
            name: 'Szépirodalom Kollégium',
            organizationId: decisionOrganization.id,
        });

        const awardScheme = await createAwardScheme({
            name: 'Irodalmi támogatás',
            type: AwardSchemeType.GRANT,
            organizationId: decisionOrganization.id,
        });

        const sourceDocument = await createSourceDocument({});

        const awardDecisionFile: ImportFile = {
            fileName: 'award_decision_import.csv',
            mimeType: 'text/csv',
            header: [
                'recipientName',
                'awardSchemeName',
                'awardSchemeOrganizationName',
                'decisionMakerName',
                'amount',
                'purpose',
                'sourceIdentifier',
                'decisionDate',
                'sourceDocumentId',
            ],
            rows: [
                {
                    recipientName: organization.name,
                    awardSchemeName: awardScheme.name,
                    awardSchemeOrganizationName: decisionOrganization.name,
                    decisionMakerName: decisionAuthority.name,
                    amount: 'not-a-number',
                    purpose: 'Folyóirat támogatás',
                    sourceIdentifier: 'NKA-2024-003',
                    decisionDate: new Date('2024-05-01'),
                    sourceDocumentId: sourceDocument.id,
                },
            ],
        };

        await expect(
            importer.import('awardDecision', awardDecisionFile)
        ).rejects.toThrow(ImportValidationError);
    });
});
