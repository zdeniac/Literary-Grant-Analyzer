import { ListQueryParams } from "../common/types/types";
import { ListDbQueryOptions } from "./types";

export class ListDbQueryBuilder<TSortableField extends string = string>
{
    constructor(
        //private readonly buildWhere: (filter: TFilter) => object,
    ) {}

    build(query?: ListQueryParams<TSortableField>): ListDbQueryOptions
    {
        if (!query) {
            return {};
        }

        const result: ListDbQueryOptions = {};

        // if (query.filter) {
        //     result.where = this.buildWhere(query.filter);
        // }

        if (query.sort && query.order) {
            result.orderBy = {
                [query.sort]: query.order === 'ASC' ? 'asc' : 'desc',
            };
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