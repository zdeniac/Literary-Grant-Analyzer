import { awardSchemeSchema } from "../validation/award-scheme.schema";
import z from "zod";

export type AwardSchemeModel = AwardSchemeDto;
export type AwardSchemeDto = z.infer<typeof awardSchemeSchema>;
