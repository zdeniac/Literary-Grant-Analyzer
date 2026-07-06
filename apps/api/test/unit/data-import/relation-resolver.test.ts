import { describe, vi, it, expect, beforeEach } from "vitest";
import { RelationResolver } from "../../../src/modules/data-import/resolver/relation-resolver";
import { ImportRow, ModelName } from "../../../src/modules/data-import/types/import.types";
import { ImportTargetRepository } from "../../../src/db/types";
import { JournalStatus } from "@prisma/client";

describe('RelationResolver', () => {
    const findManyBy = vi.fn<ImportTargetRepository['findManyBy']>();
    const createMany = vi.fn<ImportTargetRepository['createMany']>();
    const repositories = {
        organization: {
            findManyBy,
            createMany
        },
        journal: {
            findManyBy,
            createMany,
        }
    } satisfies Record<ModelName, ImportTargetRepository>;
    
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

        await expect(
            resolver.resolve(importRows, {
                model: 'organization',
                sourceField: 'organizationName',
                lookupField: 'name',
                targetField: 'id',
                foreignKey: 'organizationId',
            })
        )
        .rejects
        .toThrow('Missing foreign record with data: Alföld Alapítvány');
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
});