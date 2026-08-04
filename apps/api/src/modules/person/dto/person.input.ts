import z from "zod";
import { createPersonSchema, createPersonWithActorIdSchema, updatePersonSchema } from "../validation/person.schema";

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type CreatePersonInputWithActorIdSchema = z.infer<typeof createPersonWithActorIdSchema>;

export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;