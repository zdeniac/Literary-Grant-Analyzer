import { toLowerCase, trim } from "zod";
import { LookupConfig } from "../types/import-lookup.types";

export const orgNameLookupConfig: LookupConfig = new Map([
    [
        'organizationName',
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
