import { describe, expect, it, beforeEach } from "vitest";
import { ImportFile } from "../../../src/modules/dataImport/types/data-import.types";
import { JournalStatus, LegalForm } from "@prisma/client";
import { ImportValidationError } from "../../../src/modules/dataImport/error/data-import.errors";
import { prisma } from "../../../src/db/prisma";
import { PrismaImportTargetRepository, } from "../../../src/modules/dataImport/prisma-import-target.repository";
import { DataImportService } from "../../../src/modules/dataImport/data-import.service";
import { dataImporterBlueprints } from "../../../src/modules/dataImport/blueprint/data-import.blueprints";

describe('dataImporter', () => {

    const importer = new DataImportService(
        dataImporterBlueprints,
        {
            organization: new PrismaImportTargetRepository,(prisma.organization),
            journal: new PrismaImportTargetRepository,(prisma.journal),
        },
    );

    const org1 = {
        name: 'Jelenkor Alapítvány',
        legalForm: LegalForm.FOUNDATION,
        address: 'Pécs',
        foundingYear: 1990,
    };

    const org2 = {
        name: 'Alföld Alapítvány',
        legalForm: LegalForm.FOUNDATION,
        address: 'Szeged',
        foundingYear: 1989,
    };

    const orgFile: ImportFile = {
        name: 'organizations_import.csv',
        mimeType: 'text/csv',
        header: [
            'name',
            'legalForm',
            'address',
            'foundingYear',
        ],
        rows: [
            org1,
            org2,
        ]
    };

    const journal1 = {
        name: 'Alföld',
        issn: '2049-3630',
        status: JournalStatus.ACTIVE,
        foundingYear: 1989,
        organizationName: 'Alföld Alapítvány',
    };

    const journalFile: ImportFile = {
        name: 'jorno_import.csv',
        mimeType: 'text/csv',
        header: [
            'name',
            'issn',
            'status',
            'foundingYear',
            'organizationName',
        ],
        rows: [
            journal1,
        ]
    };

    beforeEach(async () => {
        await prisma.journal.deleteMany();
        await prisma.organization.deleteMany();
    });

    it('imports data on model without relation', async() => {
        const imported = await importer.import('organization', orgFile);

        expect(imported).toBe(2);

        // Make 100% sure we didn't import more than one of each
        const importedOrgs = await prisma.organization.findMany({
            where: { 
                name: org1.name,
             }
        });

        expect(importedOrgs.length).toBe(1);

        const importedOrg = importedOrgs[0];

        expect(importedOrg).toMatchObject({
            name: org1.name,
            address: org1.address,
            legalForm: org1.legalForm,
            foundingYear: org1.foundingYear,
        });

        expect(importedOrg).toHaveProperty('id');
        expect(importedOrg).toHaveProperty('createdAt');
    });

    it('imports data on model with 1:N relation', async() => {
        const org3 = await prisma.organization.create({
            data: org2
        });
        const importedJ = await importer.import('journal', journalFile);

        expect(importedJ).toBe(1);

        const importedJournals = await prisma.journal.findMany({
            where: { 
                name: journal1.name,
             }
        });

        expect(importedJournals.length).toBe(1);

        const importedJournal = importedJournals[0];

        expect(importedJournal).toMatchObject({
            name: journal1.name,
            // We don't save the '-' sign in the db for the issn's
            issn: journal1.issn.replace('-', ''),
            status: journal1.status,
            foundingYear: journal1.foundingYear,
        });

        expect(importedJournal.organizationId).toBe(org3.id);
        expect(importedJournal).toHaveProperty('id');
        expect(importedJournal).toHaveProperty('createdAt');
    });

    it('throws on unknown header', async () => {
        await expect(
            importer.import('organization', {
                name: 'organizations_import.csv',
                mimeType: 'text/csv',
                header: ['invalidField'],
                rows: [],
            })
        ).rejects.toThrow(ImportValidationError);
    });

    it('throws when referenced foreign record does not exist', async () => {
        await expect(
            importer.import('journal', journalFile)
        ).rejects.toThrow(Error);
    });

    it('throws on invalid row data', async () => {
        await expect(
            importer.import('organization', {
                ...orgFile,
                rows: [{
                    ...org1,
                    foundingYear: 'foo'
                }]
            })
        ).rejects.toThrow(ImportValidationError);
    });
});