import { AwardSchemeType } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
    awardSchemeSchema,
    createAwardSchemeSchema,
    importAwardSchemeSchema,
    updateAwardSchemeSchema,
} from "../../../src/modules/award-scheme/validation/award-scheme.schema";

const validAwardScheme = {
    id: 1,
    name: 'Kossuth-díj',
    type: AwardSchemeType.AWARD,
    organizationId: 123,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('AwardSchemeSchema', () => {
    it('parses valid input', () => {
        const result = awardSchemeSchema.parse(validAwardScheme);

        expect(result).toEqual({
            ...validAwardScheme,
            createdAt: new Date(validAwardScheme.createdAt),
            updatedAt: new Date(validAwardScheme.updatedAt),
        });
    });

    it('fails when name is invalid', () => {
        expect(() =>
            awardSchemeSchema.parse({
                ...validAwardScheme,
                name: '',
            })
        ).toThrow();
    });

    it('fails when type is invalid enum value', () => {
        expect(() =>
            awardSchemeSchema.parse({
                ...validAwardScheme,
                type: 'INVALID' as AwardSchemeType,
            })
        ).toThrow();
    });

    it('accepts a create payload without id and timestamps', () => {
        const parsed = createAwardSchemeSchema.parse({
            name: 'Kossuth-díj',
            type: AwardSchemeType.AWARD,
            organizationId: 123,
        });

        expect(parsed).toEqual({
            name: 'Kossuth-díj',
            type: AwardSchemeType.AWARD,
            organizationId: 123,
        });
    });

    it('allows partial updates', () => {
        const parsed = updateAwardSchemeSchema.parse({
            name: 'Updated award scheme',
        });

        expect(parsed).toEqual({
            name: 'Updated award scheme',
        });
    });

    it('accepts import payloads with organizationName', () => {
        const parsed = importAwardSchemeSchema.parse({
            name: 'Imported award scheme',
            type: AwardSchemeType.AWARD,
            organizationName: 'Example Org',
        });

        expect(parsed).toEqual({
            name: 'Imported award scheme',
            type: AwardSchemeType.AWARD,
            organizationName: 'Example Org',
        });
    });
});