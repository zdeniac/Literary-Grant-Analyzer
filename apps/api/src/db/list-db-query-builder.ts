import { ListOrder, ListQueryParams, SortableField } from "../common/types/types";
import { SearchQueryBuilder } from "./query-builders/search.query-builder";
import { SortQueryBuilder } from "./query-builders/sort.query-builder";
import { ListDbQueryOptions } from "./types";

export class ListDbQueryBuilder
{
    constructor(
        private readonly sortBuilder: SortQueryBuilder,
        private readonly searchBuilder: SearchQueryBuilder,
    ) {}

    build(query?: ListQueryParams): ListDbQueryOptions
    {   
        const result: ListDbQueryOptions = {};

        if (!query) {
            return result;
        }

        if (query.sort && query.order) {
            Object.assign(
                result,
                this.sortBuilder.build(
                    query.sort as SortableField, 
                    query.order as ListOrder,
                ),
            );
        }

        if (query.searchParams && query.searchParams.fields?.length) {
            Object.assign(
                result,
                this.searchBuilder.build(
                    query.searchParams.q, 
                    query.searchParams.fields
                ),
            );
        }

        if (query.perPage) {
            result.take = query.perPage;
        }

        if (query.page && query.perPage) {
            result.skip = (query.page - 1) * query.perPage;
        }

        return result;
    }
}