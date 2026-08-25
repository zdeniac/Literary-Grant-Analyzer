import { NextFunction, Request, Response } from "express";
import z from "zod";
import { validateSearchQuery } from "../validation/search-field";
import { SearchableField } from "../types/types";

export const validateSearch = <TField extends SearchableField>(validator: z.ZodType<TField>) => (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    if (req.listQueryParams?.searchParams) {
        validateSearchQuery(validator, req.listQueryParams.searchParams);
    }

    next();
};
