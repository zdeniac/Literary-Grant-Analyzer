import { describe, expect, it } from "vitest";
import { validateHeaders, validateRows } from "../../../src/modules/data-import/validation/data-import.validation";
import { ImportValidationError } from "../../../src/modules/data-import/error/import.errors";
import z from "zod";

describe('Data import validation', () => {

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

        it('throws when header contains unknown fields and not allowed', () => {
            expect(() =>
                validateHeaders(
                    ['name', 'foo'],
                    [{ name: 'asd', type: 'string', required: true }],
                    false
                )
            ).toThrow(ImportValidationError);
        });

        it('doesnt throw when header contains unknown fields and allowed', () => {
            expect(() =>
                validateHeaders(
                    ['name'],
                    [{ name: 'name', type: 'string', required: true }],
                    true
                )
            ).not.toThrow();
        });

        it('passes valid headers', () => {
            expect(() =>
                validateHeaders(
                    ['name'],
                    [{ name: 'name', type: 'string', required: true }],
                )
            ).not.toThrow();
        });

        it('reports missing header fields', () => {
            try {
                validateHeaders(
                    ['name'],
                    [
                        { name: 'name', type: 'string', required: true },
                        { name: 'email', type: 'email', required: true },
                    ]
                );

                expect.fail('Expected ImportValidationError');
            } catch (error) {
                expect(error).toBeInstanceOf(ImportValidationError);

                const e = error as ImportValidationError;

                expect(e.errors).toBeInstanceOf(Array);
                expect(e.errors.length).toBe(1);

                expect(e.errors[0]).toEqual({
                        row: 1,
                        issues: [
                            {
                                message: 'Missing field: email',
                            },
                        ],
                    },
                );
            }
        });

        it('reports unknown header fields', () => {
            try {
                validateHeaders(
                    ['name', 'foo'],
                    [
                        { name: 'name', type: 'string', required: true },
                    ]
                );

                expect.fail('Expected ImportValidationError');
            } catch (error) {
                const e = error as ImportValidationError;

                expect(e.errors).toEqual([
                    {
                        row: 1,
                        issues: [
                            {
                                message: 'Unknown field: foo',
                            },
                        ],
                    },
                ]);
            }
        });

        it('reports both missing and unknown fields', () => {
            try {
                validateHeaders(
                    ['foo'],
                    [
                        { name: 'name', type: 'string', required: true },
                    ]
                );

                expect.fail('Expected ImportValidationError');
            } catch (error) {
                const e = error as ImportValidationError;

                expect(e.errors).toHaveLength(2);

                expect(e.errors[0].issues).toEqual([
                    {
                        message: 'Missing field: name',
                    },
                ]);

                expect(e.errors[1].issues).toEqual([
                    {
                        message: 'Unknown field: foo',
                    },
                ]);
            }
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

        it('parses multiple rows', () => {
            const schema = z.object({
                name: z.string(),
            });

            expect(
                validateRows(
                    [
                        { name: 'one' },
                        { name: 'two' },
                    ],
                    schema
                )
            ).toEqual([
                { name: 'one' },
                { name: 'two' },
            ]);
        });

        it('returns transformed values', () => {
            const schema = z.object({
                name: z.string().transform(v => v.toUpperCase()),
            });

            expect(
                validateRows(
                    [{ name: 'john' }],
                    schema
                )
            ).toEqual([
                {
                    name: 'JOHN',
                },
            ]);
        });

        it('collects every invalid row', () => {
            const schema = z.object({
                name: z.string(),
            });

            try {
                validateRows(
                    [
                        { name: 1 },
                        { name: 2 },
                    ],
                    schema
                );

                expect.fail('Expected ImportValidationError');
            } catch (error) {
                const e = error as ImportValidationError;

                expect(e.errors).toHaveLength(2);

                expect(e.errors[0].row).toBe(2);
                expect(e.errors[1].row).toBe(3);
            }
        });

        it('collects errors after valid rows', () => {
            const schema = z.object({
                name: z.string(),
            });

            try {
                validateRows(
                    [
                        { name: 'John' },
                        { name: 123 },
                        { name: 456 },
                    ],
                    schema
                );

                expect.fail('Expected ImportValidationError');
            } catch (error) {
                const e = error as ImportValidationError;

                expect(e.errors).toHaveLength(2);
                expect(e.errors[0].row).toBe(3);
                expect(e.errors[1].row).toBe(4);
            }
        });    
    });
});