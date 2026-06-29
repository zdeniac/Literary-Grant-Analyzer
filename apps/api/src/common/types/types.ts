import z from "zod";
import { idSchema, yearSchema } from "../validation/schema";

export type Id = z.infer<typeof idSchema>;

export type IdParam = Id;

export type Year = z.infer<typeof yearSchema>;