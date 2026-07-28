import { describe, vi, it, expect, beforeEach } from "vitest";
import { RelationResolver } from "../../../src/modules/data-import/resolver/relation-resolver";
import { ImportLookupInterface, ImportRow, ImportWriterInterface, ModelName } from "../../../src/modules/data-import/types/import.types";
import { JournalStatus } from "@prisma/client";
import { ImportRelationError } from "../../../src/modules/data-import/error/import.errors";

describe('RelationResolver', () => {
    const findManyBy = vi.fn<ImportLookupInterface<any>['findManyBy']>();
    const createMany = vi.fn<ImportWriterInterface<any>['createMany']>();
    const repositories = {
        organization: {
            findManyBy,
            createMany
        },
        journal: {
            findManyBy,
            createMany,
        }
    } satisfies Record<ModelName, ImportLookupInterface<any> & ImportWriterInterface<any>>;
    
    let resolver: RelationResolver;
    
    beforeEach(() => {
        vi.clearAllMocks();
        resolver = new RelationResolver(repositories);
    });

    it('maps the foreign data and checks the db with them', async () => {
        repositories.organization.findManyBy.mockResolvedValue([]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                issn: '1234-5678',
                status: JournalStatus.ACTIVE,
                foundingYear: 1990,
                organizationName: 'Alföld Alapítvány', 
            },
        ];

        await expect(
            resolver.resolve(importRows, {
                model: 'organization',
                sourceField: 'organizationName',
                lookupField: 'name',
                targetField: 'id',
                foreignKey: 'organizationId',
            })
        ).rejects.toThrow();

        expect(repositories.organization.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Alföld Alapítvány']
        );
    });

    it('sets the foreign data to its lookup field', async () => {
        repositories.organization.findManyBy.mockResolvedValue([
            {
                id: 42,
                name: 'Alföld Alapítvány',
            },
        ]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                issn: '1234-5678',
                status: JournalStatus.ACTIVE,
                foundingYear: 1990,
                organizationName: 'Alföld Alapítvány', 
            },
        ];

        const result = await resolver.resolve(importRows, {
                model: 'organization',
                sourceField: 'organizationName',
                lookupField: 'name',
                targetField: 'id',
                foreignKey: 'organizationId',
        });

        expect(result).toEqual([
            {
                name: 'Alföld Folyóirat',
                issn: '1234-5678',
                status: 'ACTIVE',
                foundingYear: 1990,
                organizationId: 42,
            },
        ]);

        expect(repositories.organization.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Alföld Alapítvány'],
        );
    });

    it('throws on missing foreign record', async () => {
        repositories.organization.findManyBy.mockResolvedValue([]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                issn: '1234-5678',
                status: JournalStatus.ACTIVE,
                foundingYear: 1990,
                organizationName: 'Alföld Alapítvány', 
            },
        ];

        try {
            await resolver.resolve(importRows, {
                model: 'organization',
                sourceField: 'organizationName',
                lookupField: 'name',
                targetField: 'id',
                foreignKey: 'organizationId',
            });

            expect.fail('Expected ImportRelationError');
        } catch (e) {
            expect(e).toBeInstanceOf(ImportRelationError);
            expect(e.name).toBe('ImportRelationError');
            expect(e.message).toBe('IMPORT_RELATION_ERROR');
            expect(e.errors).toBeInstanceOf(Array);
            expect(e.errors.length).toBe(1);
        }
    });

    it('returns validated data correctly', async () => {
        repositories.organization.findManyBy.mockResolvedValue([]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                issn: '1234-5678',
                status: JournalStatus.ACTIVE,
                foundingYear: 1990,
                organizationName: 'Alföld Alapítvány', 
            },
        ];

        await expect(
            resolver.resolve(importRows, {
                model: 'organization',
                sourceField: 'organizationName',
                lookupField: 'name',
                targetField: 'id',
                foreignKey: 'organizationId',
            })
        ).rejects.toThrow();

        expect(repositories.organization.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Alföld Alapítvány']
        );
    });

    it('resolves multiple foreign relations', async () => {
        repositories.organization.findManyBy.mockResolvedValue([
            {
                id: 1,
                name: 'Alföld Alapítvány',
            },
            {
                id: 2,
                name: 'Jelenkor Alapítvány',
            },
        ]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                organizationName: 'Alföld Alapítvány',
            },
            {
                name: 'Jelenkor Folyóirat',
                organizationName: 'Jelenkor Alapítvány',
            },
        ];

        const result = await resolver.resolve(importRows, {
            model: 'organization',
            sourceField: 'organizationName',
            lookupField: 'name',
            targetField: 'id',
            foreignKey: 'organizationId',
        });

        expect(result).toEqual([
            {
                name: 'Alföld Folyóirat',
                organizationId: 1,
            },
            {
                name: 'Jelenkor Folyóirat',
                organizationId: 2,
            },
        ]);

        expect(repositories.organization.findManyBy)
            .toHaveBeenCalledWith(
                'name',
                [
                    'Alföld Alapítvány',
                    'Jelenkor Alapítvány',
                ]
            );
    });

    it('reports all missing foreign relations', async () => {
        repositories.organization.findManyBy.mockResolvedValue([]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                organizationName: 'Missing Alapítvány',
            },
            {
                name: 'Jelenkor Folyóirat',
                organizationName: 'Unknown Alapítvány',
            },
        ];

        try {
            await resolver.resolve(importRows, {
                model: 'organization',
                sourceField: 'organizationName',
                lookupField: 'name',
                targetField: 'id',
                foreignKey: 'organizationId',
            });

            expect.fail('Expected ImportRelationError');
        } catch (e) {
            expect(e).toBeInstanceOf(ImportRelationError);

            const error = e as ImportRelationError;

            expect(error.errors).toEqual([
                {
                    row: 2,
                    issues: [
                        {
                            message: 'Unknown organizationName: Missing Alapítvány',
                        },
                    ],
                },
                {
                    row: 3,
                    issues: [
                        {
                            message: 'Unknown organizationName: Unknown Alapítvány',
                        },
                    ],
                },
            ]);
        }
    });

    it('does not mutate original rows', async () => {
        repositories.organization.findManyBy.mockResolvedValue([
            {
                id: 42,
                name: 'Alföld Alapítvány',
            },
        ]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                organizationName: 'Alföld Alapítvány',
            },
        ];

        const originalRows = structuredClone(importRows);

        await resolver.resolve(importRows, {
            model: 'organization',
            sourceField: 'organizationName',
            lookupField: 'name',
            targetField: 'id',
            foreignKey: 'organizationId',
        });

        expect(importRows).toEqual(originalRows);
    });

    it('returns empty array when resolving empty input', async () => {
        repositories.organization.findManyBy.mockResolvedValue([]);

        const result = await resolver.resolve([], {
            model: 'organization',
            sourceField: 'organizationName',
            lookupField: 'name',
            targetField: 'id',
            foreignKey: 'organizationId',
        });

        expect(result).toEqual([]);

        expect(repositories.organization.findManyBy)
            .toHaveBeenCalledWith(
                'name',
                []
            );
    });

    it('keeps other row fields when replacing relation field', async () => {
        repositories.organization.findManyBy.mockResolvedValue([
            {
                id: 5,
                name: 'Alföld Alapítvány',
            },
        ]);

        const importRows: ImportRow[] = [
            {
                name: 'Alföld Folyóirat',
                issn: '12345678',
                status: JournalStatus.ACTIVE,
                foundingYear: 1990,
                organizationName: 'Alföld Alapítvány',
                extraField: 'keep-me',
            },
        ];

        const result = await resolver.resolve(importRows, {
            model: 'organization',
            sourceField: 'organizationName',
            lookupField: 'name',
            targetField: 'id',
            foreignKey: 'organizationId',
        });

        expect(result).toEqual([
            {
                name: 'Alföld Folyóirat',
                issn: '12345678',
                status: JournalStatus.ACTIVE,
                foundingYear: 1990,
                extraField: 'keep-me',
                organizationId: 5,
            },
        ]);
    });
});