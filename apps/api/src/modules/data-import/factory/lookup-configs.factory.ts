import { toLowerCase, trim } from "zod";
import { LookupConfig } from "../types/import.types";

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
