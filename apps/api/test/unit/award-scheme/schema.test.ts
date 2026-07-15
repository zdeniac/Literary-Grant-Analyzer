import { AwardSchemeSchema } from "../../../src/modules/award-scheme/validation/award-scheme.schema";
import { AwardSchemeType } from "@prisma/client";
import { describe, expect, it } from "vitest";

describe('AwardSchemeSchema', () => {
    const validInput = {
        name: 'Kossuth-díj',
        type: AwardSchemeType.AWARD,
        organizationId: 123,
    };

    it('parses valid input', () => {
        const result = AwardSchemeSchema.parse(validInput);

        expect(result).toEqual(validInput);
    });

    it('fails when name is invalid', () => {
        expect(() =>
            AwardSchemeSchema.parse({
                ...validInput,
                name: '',
            })
        ).toThrow();
    });

    it('fails when type is invalid enum value', () => {
        expect(() =>
            AwardSchemeSchema.parse({
                ...validInput,
                type: 'INVALID',
            } as any)
        ).toThrow();
    });

    it('fails when organizationId is missing', () => {
        expect(() =>
            AwardSchemeSchema.parse({
                ...validInput,
                organizationId: undefined,
            })
        ).toThrow();
    });
});