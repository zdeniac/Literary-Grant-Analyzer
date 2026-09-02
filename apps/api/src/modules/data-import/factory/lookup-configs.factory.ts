import { LookupConfig } from "../types/import-lookup.types";

export const trim = (value: unknown): string => String(value).trim();
export const toLowerCase = (value: unknown): string => String(value).toLowerCase();

export const organizationLookupConfig: LookupConfig = new Map([
    [
        'name',
        {
            normalizers: [
                trim,
                toLowerCase
            ],
            query: {
                mode: 'insensitive'
            }
        },
    ],
    [
        'nameVariants',
        {
            normalizers: [
                trim,
                toLowerCase
            ],
            query: {
                type: 'array',
            },
        }
    ]
]);

export const awardSchemeLookupConfig: LookupConfig = new Map([
    [
        'name',
        {
            normalizers: [
                trim,
                toLowerCase
            ],
            query: {
                mode: 'insensitive'
            }
        }
    ]
]);

export const decisionAuthorityLookupConfig: LookupConfig = new Map([
    [
        'name',
        {
            normalizers: [
                trim,
                toLowerCase
            ],
            query: {
                mode: 'insensitive'
            }
        }
    ]
]);


export const sourceDocumentLookupConfig: LookupConfig = new Map([
    [
        'url',
        {
            normalizers: [
                trim,
                toLowerCase
            ],
            query: {
                mode: 'insensitive'
            }
        }
    ]
]);


