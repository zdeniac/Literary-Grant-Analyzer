import z from "zod";
import { sourceDocumentSearchableFieldSchema, sourceDocumentSortableFieldSchema } from "../validation/source-document.schema";

export type SourceDocumentSortableField = z.infer<typeof sourceDocumentSortableFieldSchema>;
export type SourceDocumentSearchableField = z.infer<typeof sourceDocumentSearchableFieldSchema>;