import { awardSchemeSchema } from "../../../src/modules/award-scheme/validation/award-scheme.schema";
import { AwardSchemeType } from "@prisma/client";
import { describe, expect, it } from "vitest";

describe('AwardSchemeSchema', () => {
    const validInput = {
        name: 'Kossuth-díj',
        type: AwardSchemeType.AWARD,
        organizationId: 123,
    };

    it('parses valid input', () => {
        const result = awardSchemeSchema.parse(validInput);

        expect(result).toEqual(validInput);
    });

    it('fails when name is invalid', () => {
        expect(() =>
            awardSchemeSchema.parse({
                ...validInput,
                name: '',
            })
        ).toThrow();
    });

    it('fails when type is invalid enum value', () => {
        expect(() =>
            awardSchemeSchema.parse({
                ...validInput,
                type: 'INVALID',
            } as any)
        ).toThrow();
    });

    it('fails when organizationId is missing', () => {
        expect(() =>
            awardSchemeSchema.parse({
                ...validInput,
                organizationId: undefined,
            })
        ).toThrow();
    });
});