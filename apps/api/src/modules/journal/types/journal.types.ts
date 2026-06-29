import z from "zod";
import { issnSchema } from "../validate/journal.schema";

export type Issn = z.infer<typeof issnSchema>