import z from "zod";
import { personSortableFieldSchema } from "../validation/person.schema";

export type PersonSortableField = z.infer<typeof personSortableFieldSchema>;