import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { ImportFile } from "../../../src/modules/data-import/types/import.types";
import { 
    JournalStatus, 
    LegalForm, 
    Sector,
    AwardSchemeType,
} from "@prisma/client";
import { ImportValidationError } from "../../../src/modules/data-import/error/import.errors";
import { prisma } from "../../../src/db/prisma";
import { wipeDatabase } from "../helpers/db.helper";
import { createOrganization } from "../helpers/factories/organization.factory";
import { createImportModule } from "../../../src/modules/data-import/factory/import.factory";
import { CreateOrganizationInput } from "../../../src/modules/organization/dto/organization.input.dto";
import { createAwardScheme } from "../helpers/factories/award-scheme.factory";
import { createDecisionBody } from "../helpers/factories/decision-body.factory";
import { createSourceDocument } from "../helpers/factories/source-document.factory";

describe('Data Import Service test', () => {
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

    const orgFile: ImportFile = {
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
        rows: [
            org1,
            org2,
        ]
    };

    const awardSchemeFile: ImportFile = {
        fileName: 'award_scheme_import.csv',
        mimeType: 'text/csv',
        header: [
            'name',
            'type',
            'organizationName',
        ],
        rows: [
            {
                name: 'Irodalmi támogatás',
                type: AwardSchemeType.GRANT,
                organizationName: 'Alföld Alapítvány',
            }
        ]
    };

    const journalFile: ImportFile = {
        fileName: 'journal_import.csv',
        mimeType: 'text/csv',
        header: [
            'name',
            'issn',
            'status',
            'foundingYear',
            'format',
            'organizationNames',
        ],
        rows: [
            {
                name: 'Alföld',
                issn: '2049-3610',
                status: JournalStatus.ACTIVE,
                format: 'ONLINE|PRINT',
                foundingYear: 1989,
                organizationNames: org1.name + '|' + org2.name,
            },
        ]
    };

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('imports data on model without relation', async() => {
        const imported = await importer.import(
            'organization',
            orgFile
        );

        expect(imported).toBe(2);

        const importedOrg = await prisma.organization.findFirst({
            where: {
                name: org1.name
            }
        });

        expect(importedOrg).toMatchObject({
            name: org1.name,
            address: org1.address,
            legalForm: org1.legalForm,
            foundingYear: org1.foundingYear,
        });

        expect(importedOrg).toHaveProperty('id');
        expect(importedOrg).toHaveProperty('createdAt');
    });

    it('imports data with N:1 relation (award scheme -> organization)', async() => {
        await createOrganization(org2);

        const imported = await importer.import(
            'awardScheme',
            awardSchemeFile
        );

        expect(imported).toBe(1);

        const schemes = await prisma.awardScheme.findMany({
            where: {
                name: 'Irodalmi támogatás'
            },
            include: {
                organization: true,
            }
        });

        expect(schemes.length).toBe(1);

        expect(schemes[0]).toMatchObject({
            name: 'Irodalmi támogatás',
            type: AwardSchemeType.GRANT,
            organization: {
                name: 'Alföld Alapítvány'
            }
        });

        expect(schemes[0]).toHaveProperty('organizationId');
    });

    it('imports data with N:M relation (journal -> organizations)', async() => {
        await createOrganization(org1);
        await createOrganization(org2);

        const imported = await importer.import(
            'journal',
            journalFile
        );

        expect(imported).toBe(1);

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
                affiliation => affiliation.organization.name
            )
        )
        .toEqual(
            expect.arrayContaining([
                'Alföld Alapítvány',
                'Jelenkor Alapítvány',
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
        ).rejects.toThrow(ImportValidationError);
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
        .toThrow(ImportValidationError);
    });

    it.only('awardDecisions is imported correctly', async () => {
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

        const decisionBody = await createDecisionBody({
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
                'decisionMakerName',
                'amount',
                'purpose',
                'sourceIdentifier',
                'decisionDate',
            ],
            rows: [
                {
                    recipientName: organization.name,
                    awardSchemeName: awardScheme.name,
                    decisionMakerName: decisionBody.name,
                    amount: 500,
                    purpose: 'Folyóirat támogatás',
                    sourceIdentifier: 'NKA-2024-001',
                    decisionDate: new Date('2024-05-01'),
                    sourceDocumentId: sourceDocument.id
                }
            ]
        };

        await importer.import(
            'awardDecision',
            awardDecisionFile
        );
        
        const decision = await prisma.awardDecision.findFirst({
            where: {
                sourceIdentifier: 'NKA-2024-001'
            },
            include: {
                recipient: {
                    include: {
                        organization: true
                    }
                },
                decisionMaker: {
                    include: {
                        decisionBody: true
                    }
                },
                awardScheme: true,
                sourceDocument: true,
            }
        });

        expect(decision!.amount?.toNumber()).toBe(500);
        expect(decision).not.toBeNull();

        expect(decision).toMatchObject({
            purpose: 'Folyóirat támogatás',
            sourceIdentifier: 'NKA-2024-001',

            awardScheme: {
                id: awardScheme.id,
                name: 'Irodalmi támogatás'
            },

            recipient: {
                organization: {
                    id: organization.id,
                    name: 'Alföld Alapítvány'
                }
            },

            decisionMaker: {
                decisionBody: {
                    id: decisionBody.id,
                    name: 'Szépirodalom Kollégium'
                }
            },

            sourceDocument: {
                id: sourceDocument.id,
            }
        });
    });
});