import z from "zod";
import { importJobSortableFieldSchema } from "../validation/import-job.validation";

export type ImportJobSortableField = z.infer<typeof importJobSortableFieldSchema>;