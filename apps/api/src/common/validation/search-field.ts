import z from "zod";
import { InvalidQueryParamError } from "../errors/invalid-query-param.error";
import { SearchQueryParams } from "../types/types";

export const validateSearchQuery = (validator: z.ZodType, query: SearchQueryParams,): void => 
{
    try {
        validator.parse(query);
    } catch (e: unknown) {
        throw new InvalidQueryParamError(
            query.fields?.join(',') ?? query.q ?? 'search'
        );
    }
};