import { NextFunction, Request, Response } from "express";
import { parseListQueryParams } from "../http/parse-list-query-params";

export const parseListQuery = (req: Request, res: Response, next: NextFunction): Response | void => 
{
    req.listQueryParams = parseListQueryParams(req.query);
    next();
};