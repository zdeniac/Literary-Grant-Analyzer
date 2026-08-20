import z from "zod";
import { personSearchableFieldSchema, personSortableFieldSchema } from "../validation/person.schema";

export type PersonSortableField = z.infer<typeof personSortableFieldSchema>;
export type PersonSearchableField = z.infer<typeof personSearchableFieldSchema>;