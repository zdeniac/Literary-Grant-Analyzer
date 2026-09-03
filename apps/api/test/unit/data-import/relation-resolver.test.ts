import { describe, vi, it, expect, beforeEach } from "vitest";
import { CompositeRelationResolver } from "../../../src/modules/data-import/resolver/composite-relation-resolver";
import { SimpleRelationResolver } from "../../../src/modules/data-import/resolver/simple-relation-resolver";
import { ImportRow } from "../../../src/modules/data-import/types/import.types";
import { JournalStatus } from "@prisma/client";
import { ImportLookupInterface } from "../../../src/modules/data-import/types/import-lookup.types";
import { ImportWriterInterface } from "../../../src/modules/data-import/types/service.types";
import { EntityName } from "../../../src/common/types/types";
import { ImportLookupRegistry } from "../../../src/modules/data-import/registry/import-lookup.registry";
import { OrganizationEntity } from "../../../src/modules/organization/dto/organization.dto";
import { JournalEntity } from "../../../src/modules/journal/dto/journal.dto";
import { ImportRelationError } from "../../../src/modules/data-import/error/import.errors";

describe('RelationResolver', () => {
    const organizationLookup = {
        findManyBy: vi.fn<ImportLookupInterface<any>['findManyBy']>(),
        normalize: vi.fn<ImportLookupInterface<any>['normalize']>(),
    } satisfies ImportLookupInterface<OrganizationEntity>;

    const journalLookup = {
        findManyBy: vi.fn<ImportLookupInterface<any>['findManyBy']>(),
        normalize: vi.fn<ImportLookupInterface<any>['normalize']>(),
    } satisfies ImportLookupInterface<JournalEntity>;
 
    const getOrThrow = vi.fn<ImportLookupRegistry['getOrThrow']>();

    const importLookupRegistry = {
        getOrThrow,
        get: vi.fn<ImportLookupRegistry['get']>(),
        has: vi.fn<ImportLookupRegistry['has']>(),
        getAll: vi.fn<ImportLookupRegistry['getAll']>(),
    } satisfies Pick<
        ImportLookupRegistry,
        'getOrThrow' | 'get' | 'has' | 'getAll'
    >;    

    let resolver: SimpleRelationResolver;

    beforeEach(() => {
        vi.clearAllMocks();

        // Needed for identity mock, so the returned value is correct
        organizationLookup.normalize.mockImplementation(
            (_field, value) => value
        );

        journalLookup.normalize.mockImplementation(
            (_field, value) => value
        );

        getOrThrow.mockImplementation((entity) => {
            switch (entity) {
                case 'organization':
                    return organizationLookup;

                case 'journal':
                    return journalLookup;

                default:
                    throw new Error(`Unexpected entity: ${entity}`);
            }
        });

        resolver = new SimpleRelationResolver(importLookupRegistry);
    });

    it('maps the foreign data and checks the db with them', async () => {
        organizationLookup.findManyBy.mockResolvedValue([]);
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

        expect(organizationLookup.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Alföld Alapítvány']
        );
    });

    it('sets the foreign data to its lookup field', async () => {
        organizationLookup.findManyBy.mockResolvedValue([
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

        expect(organizationLookup.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Alföld Alapítvány'],
        );
    });

    it('throws on missing foreign record', async () => {
        organizationLookup.findManyBy.mockResolvedValue([]);

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

            expect(error.name).toBe('ImportRelationError');
            expect(error.code).toBe('IMPORT_RELATION_ERROR');
            expect(error.errors).toBeInstanceOf(Array);
            expect(error.errors.length).toBe(1);
        }
    });

    it('returns validated data correctly', async () => {
        organizationLookup.findManyBy.mockResolvedValue([]);

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

        expect(organizationLookup.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Alföld Alapítvány']
        );
    });

    it('resolves multiple foreign relations', async () => {
        organizationLookup.findManyBy.mockResolvedValue([
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

        expect(organizationLookup.findManyBy)
            .toHaveBeenCalledWith(
                'name',
                [
                    'Alföld Alapítvány',
                    'Jelenkor Alapítvány',
                ]
            );
    });

    it('reports all missing foreign relations', async () => {
        organizationLookup.findManyBy.mockResolvedValue([]);

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
                    rowNum: 2,
                    issues: [
                        {
                            field: 'organizationName',
                            value: 'Missing Alapítvány',
                            message: 'No organizationName with value "Missing Alapítvány" found in the database.',
                        },
                    ],
                },
                {
                    rowNum: 3,
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
        organizationLookup.findManyBy.mockResolvedValue([
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
        organizationLookup.findManyBy.mockResolvedValue([]);

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

        expect(organizationLookup.findManyBy)
            .toHaveBeenCalledWith(
                'name',
                []
            );
    });

    it('keeps other row fields when replacing relation field', async () => {
        organizationLookup.findManyBy.mockResolvedValue([
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
    const organizationLookup = {
        findManyBy: vi.fn<ImportLookupInterface<any>['findManyBy']>(),
        normalize: vi.fn<ImportLookupInterface<any>['normalize']>(),
    } satisfies ImportLookupInterface<OrganizationEntity>;

    const awardSchemeLookup = {
        findManyBy: vi.fn<ImportLookupInterface<any>['findManyBy']>(),
        normalize: vi.fn<ImportLookupInterface<any>['normalize']>(),
    } satisfies ImportLookupInterface<any>;

    const getOrThrow = vi.fn<ImportLookupRegistry['getOrThrow']>();

    const importLookupRegistry = {
        getOrThrow,
        get: vi.fn<ImportLookupRegistry['get']>(),
        has: vi.fn<ImportLookupRegistry['has']>(),
        getAll: vi.fn<ImportLookupRegistry['getAll']>(),
    } satisfies Pick<
        ImportLookupRegistry,
        'getOrThrow' | 'get' | 'has' | 'getAll'
    >;

    let compositeResolver: CompositeRelationResolver;

    beforeEach(() => {
        vi.clearAllMocks();

        organizationLookup.normalize.mockImplementation(
            (_field, value) => value
        );

        awardSchemeLookup.normalize.mockImplementation(
            (_field, value) => value
        );

        getOrThrow.mockImplementation((entity) => {
            switch (entity) {
                case 'organization':
                    return organizationLookup;

                case 'awardScheme':
                    return awardSchemeLookup;

                default:
                    throw new Error(`Unexpected entity: ${entity}`);
            }
        });

        compositeResolver = new CompositeRelationResolver(
            importLookupRegistry
        );
    });

    it('resolves award scheme by name and organization name for composite lookup', async () => {
        organizationLookup.findManyBy.mockResolvedValue([
            { id: 11, name: 'Central Foundation' },
        ]);

        awardSchemeLookup.findManyBy.mockResolvedValue([
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

        expect(organizationLookup.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Central Foundation'],
        );

        expect(awardSchemeLookup.findManyBy).toHaveBeenCalledWith(
            'name',
            ['Best Grant'],
        );

        expect(awardSchemeLookup.findManyBy).toHaveBeenCalledWith(
            'organizationId',
            [11],
        );
    });
});
