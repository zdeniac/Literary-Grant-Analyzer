import { ListOrder, ListQueryParams, SortableField } from "../common/types/types";
import { ListDbQueryOptions, SearchQueryBuilderInterface, SortQueryBuilderInterface } from "./types";

export class ListDbQueryBuilder
{
    constructor(
        private readonly sortBuilder: SortQueryBuilderInterface,
        private readonly searchBuilder: SearchQueryBuilderInterface,
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