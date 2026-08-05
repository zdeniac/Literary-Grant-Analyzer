import { describe, vi, it, expect, beforeEach } from "vitest";
import { CompositeRelationResolver } from "../../../src/modules/data-import/resolver/composite-relation-resolver";
import { SimpleRelationResolver } from "../../../src/modules/data-import/resolver/simple-relation-resolver";
import { ImportLookupInterface, ImportRow, ImportWriterInterface, EntityName } from "../../../src/modules/data-import/types/import.types";
import { JournalStatus } from "@prisma/client";
import { ImportValidationError as ImportRelationError } from "../../../src/modules/data-import/error/import.errors";

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
    } satisfies Record<EntityName, ImportLookupInterface<any> & ImportWriterInterface<any>>;
    
    let resolver: SimpleRelationResolver;
    
    beforeEach(() => {
        vi.clearAllMocks();
        resolver = new SimpleRelationResolver(repositories);
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
                entity: 'organization',
                lookup: {
                    sourceField: 'organizationName',
                    lookupField: 'name',
                },
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
            entity: 'organization',
            lookup: {
                sourceField: 'organizationName',
                lookupField: 'name',
            },
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
                entity: 'organization',
                lookup: {
                    sourceField: 'organizationName',
                    lookupField: 'name',
                },
                targetField: 'id',
                foreignKey: 'organizationId',
            });

            expect.fail('Expected ImportRelationError');
        } catch (e) {
            expect(e).toBeInstanceOf(ImportRelationError);
            const error = e as ImportRelationError;
            expect(error.name).toBe('ImportValidationError');
            expect(error.message).toBe('IMPORT_RELATION_ERROR');
            expect(error.errors).toBeInstanceOf(Array);
            expect(error.errors.length).toBe(1);
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
                entity: 'organization',
                lookup: {
                    sourceField: 'organizationName',
                    lookupField: 'name',
                },
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
            entity: 'organization',
            lookup: {
                sourceField: 'organizationName',
                lookupField: 'name',
            },
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
                entity: 'organization',
                lookup: {
                    sourceField: 'organizationName',
                    lookupField: 'name',
                },
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
                            field: 'organizationName',
                            value: 'Missing Alapítvány',
                            message: 'No organizationName with value "Missing Alapítvány" found in the database.',
                        },
                    ],
                },
                {
                    row: 3,
                    issues: [
                        {
                            field: 'organizationName',
                            value: 'Unknown Alapítvány',
                            message: 'No organizationName with value "Unknown Alapítvány" found in the database.',
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
            entity: 'organization',
            lookup: {
                sourceField: 'organizationName',
                lookupField: 'name',
            },
            targetField: 'id',
            foreignKey: 'organizationId',
        });

        expect(importRows).toEqual(originalRows);
    });

    it('returns empty array when resolving empty input', async () => {
        repositories.organization.findManyBy.mockResolvedValue([]);

        const result = await resolver.resolve([], {
            entity: 'organization',
            lookup: {
                sourceField: 'organizationName',
                lookupField: 'name',
            },
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
            entity: 'organization',
            lookup: {
                sourceField: 'organizationName',
                lookupField: 'name',
            },
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

describe('CompositeRelationResolver', () => {
    const organizationFindManyBy = vi.fn<ImportLookupInterface<any>['findManyBy']>();
    const awardSchemeFindManyBy = vi.fn<ImportLookupInterface<any>['findManyBy']>();
    const compositeRepositories = {
        organization: {
            findManyBy: organizationFindManyBy,
        },
        awardScheme: {
            findManyBy: awardSchemeFindManyBy,
        },
    } satisfies Record<EntityName, ImportLookupInterface<any>>;

    let compositeResolver: CompositeRelationResolver;

    beforeEach(() => {
        vi.clearAllMocks();
        compositeResolver = new CompositeRelationResolver(compositeRepositories);
    });

    it('resolves award scheme by name and organization name for composite lookup', async () => {
        organizationFindManyBy.mockResolvedValue([
            { id: 11, name: 'Central Foundation' },
        ]);

        awardSchemeFindManyBy.mockResolvedValue([
            { id: 100, name: 'Best Grant', organizationId: 11 },
        ]);

        const importRows: ImportRow[] = [
            {
                awardSchemeName: 'Best Grant',
                awardSchemeOrganizationName: 'Central Foundation',
            },
        ];

        const result = await compositeResolver.resolve(importRows, {
            entity: 'awardScheme',
            lookup: [
                {
                    sourceField: 'awardSchemeName',
                    lookupField: 'name',
                },
                {
                    sourceField: 'awardSchemeOrganizationName',
                    lookupField: 'name',
                    foreignEntity: 'organization',
                    foreignKey: 'organizationId',
                },
            ],
            foreignKey: 'awardSchemeId',
            targetField: 'id',
        });

        expect(result).toEqual([
            {
                awardSchemeId: 100,
            },
        ]);

        expect(organizationFindManyBy).toHaveBeenCalledWith(
            'name',
            ['Central Foundation'],
        );

        expect(awardSchemeFindManyBy).toHaveBeenCalledWith(
            'name',
            ['Best Grant'],
        );

        expect(awardSchemeFindManyBy).toHaveBeenCalledWith(
            'organizationId',
            [11],
        );
    });
});
