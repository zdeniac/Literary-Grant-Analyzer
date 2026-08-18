import z from "zod";

export const importJobSortableFieldSchema = z.enum([
    'id',
    'model',
    'fileName',
    'mimeType',
    'status',
    'totalRows',
    'importedRows',
    'failedRows',
    'startedAt',
    'finishedAt'
]);