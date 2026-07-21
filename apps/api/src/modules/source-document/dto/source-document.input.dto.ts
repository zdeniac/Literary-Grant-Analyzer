import z from "zod";
import { createSourceDocumentSchema, updateSourceDocumentSchema } from "../validation/source-document.schema";

export type CreateSourceDocumentInput = z.infer<typeof createSourceDocumentSchema>;
export type UpdateSourceDocumentInput = z.infer<typeof updateSourceDocumentSchema>;