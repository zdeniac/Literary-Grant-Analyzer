import { describe, expect, it } from "vitest";
import { validateHeaders, validateRows } from "../../../src/modules/data-import/validation/data-import.validation";
import { ImportValidationError } from "../../../src/modules/data-import/error/import.errors";
import z from "zod";

describe('data import validation', () => {

    describe('validateHeaders', () => {
        it('throws when header misses fields', () => {
            expect(() =>
                validateHeaders(
                    ['name'],
                    [
                        { name: 'name', type: 'string', required: true },
                        { name: 'email', type: 'email', required: true },
                    ],
                )
            ).toThrow(ImportValidationError);
        });

        it('throws when header contains unknown fields', () => {
            expect(() =>
                validateHeaders(
                    ['name', 'foo'],
                    [{ name: 'asd', type: 'string', required: true }],
                )
            ).toThrow(ImportValidationError);
        });

        it('passes valid headers', () => {
            expect(() =>
                validateHeaders(
                    ['name'],
                    [{ name: 'name', type: 'string', required: true }],
                )
            ).not.toThrow();
        });
    });

    describe('validateRows', () => {
        it('returns parsed rows', () => {
            const schema = z.object({
                name: z.string()
            });

            const result = validateRows(
                [{ name: 'test' }],
                schema
            );

            expect(result)
                .toEqual([
                    { name: 'test' }
                ]);
        });


        it('throws on invalid rows', () => {
            const schema = z.object({
                name: z.string()
            });

            expect(() =>
                validateRows([{ name: 123 }], schema)
            ).toThrow(ImportValidationError);

        });

        it('throws on empty rows', () => {
            const schema = z.object({
                name: z.string()
            });

            expect(() =>
                validateRows([{}], schema)
            ).toThrow(ImportValidationError);

        });
    });

});