import { Request } from "express";
import { ListOrder, ListQueryParams } from "../types/types";

export const parseListQueryParams = (query: Request['query']): ListQueryParams => ({
    page: query.page
        ? Number(query.page)
        : undefined,

    perPage: query.perPage
        ? Number(query.perPage)
        : undefined,

    filter: query.filter
        ? JSON.parse(String(query.filter))
        : undefined,

    order: query.order
        ? String(query.order) as ListOrder
        : undefined,

    sort: query.sort
        ? String(query.sort)
        : undefined,
});