import z from "zod";
import { personSchema } from "../validation/person.schema";

export type PersonEntity = PersonDto;
export type PersonDto = z.infer<typeof personSchema>;
