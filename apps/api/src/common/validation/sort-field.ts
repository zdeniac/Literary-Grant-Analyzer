import z from "zod";
import { InvalidQueryParamError } from "../errors/invalid-query-param.error";

export const validateSortField = (validator: z.ZodType, field: string) => {
    try {
        validator.parse(field);   
    } catch (e: unknown) {
        throw new InvalidQueryParamError(field);
    }
};
