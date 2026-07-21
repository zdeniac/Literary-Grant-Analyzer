import z from "zod";
import { createAwardSchemeSchema, updateAwardSchemeSchema } from "../validation/award-scheme.schema";

export type CreateAwardSchemeInput = z.infer<typeof createAwardSchemeSchema>;
export type UpdateAwardSchemeInput = z.infer<typeof updateAwardSchemeSchema>;