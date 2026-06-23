import { describe, expect, it } from "vitest";
import { createDataImportModule } from "../../../src/modules/dataImport/data-import.factory";
import { ImportFile } from "../../../src/modules/dataImport/types/data-import.types";
import { LegalForm, Organization } from "@prisma/client";
import { ImportError, ImportValidationError } from "../../../src/modules/dataImport/error/data-import.errors";
import { prisma } from "../../../src/db/prisma";

describe('dataImporter', () => {

    const dataImporter = createDataImportModule<Organization>(prisma.organization).service;

    const file: ImportFile = {
        name: 'organizations_import.csv',
        extension: 'csv',
        header: [
            'name',
            'legalForm',
            'address',
            'foundingYear',
        ],
        rows: [
            {
                name: 'Jelenkor Alapítvány',
                legalForm: LegalForm.FOUNDATION,
                address: 'Pécs',
                foundingYear: 1990,
            },
            {
                name: 'Alföld Alapítvány',
                legalForm: LegalForm.FOUNDATION,
                address: 'Szeged',
                foundingYear: 1989,
            },
        ]
    };

    it('throws on missing blueprint', async () => {
        await expect(
            dataImporter.import('orgog', file)
        ).rejects.toThrow(ImportError);
    });

    it('throws on unknown header', async () => {
        await expect(
            dataImporter.import('organization', {
                name: 'organizations_import.csv',
                extension: 'csv',
                header: ['invalidField'],
                rows: [],
            })
        ).rejects.toThrow(ImportValidationError);
    });

    it('throws on empty rows', async () => {
        await expect(
            dataImporter.import('organization', {
                name: 'organizations_import.csv',
                extension: 'csv',
                header: [
                    'name', 
                    'legalForm', 
                    'address', 
                    'foundingYear',
                ],
                rows: [],
            })
        ).rejects.toThrow(ImportError);
    });

    it('validates headers', async () => {

    });
});