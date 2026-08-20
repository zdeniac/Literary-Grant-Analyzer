import z from "zod";
import { importJobSearchableFieldSchema, importJobSortableFieldSchema } from "../validation/import-job.validation";

export type ImportJobSortableField = z.infer<typeof importJobSortableFieldSchema>;
export type ImportJobSearchableField= z.infer<typeof importJobSearchableFieldSchema>;