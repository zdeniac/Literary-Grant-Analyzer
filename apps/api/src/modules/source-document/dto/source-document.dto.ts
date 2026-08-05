import z from "zod";
import { sourceDocumentSchema } from "../validation/source-document.schema";

export type SourceDocumentEntity = SourceDocumentDto;
export type SourceDocumentDto = z.infer<typeof sourceDocumentSchema>;
