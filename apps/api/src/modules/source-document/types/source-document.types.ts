import z from "zod";
import { sourceDocumentSortableFieldSchema } from "../validation/source-document.schema";

export type SourceDocumentSortableField = z.infer<typeof sourceDocumentSortableFieldSchema>;