import { ListOrder, SortableField } from "../../common/types/types";
import { ListDbQueryOptions } from "../types";

export class SortQueryBuilder
{
    build(sort: SortableField, order: ListOrder): ListDbQueryOptions
    {
        return {
            orderBy: {
                [sort]: order === 'ASC'
                    ? 'asc'
                    : 'desc',
            },
        };
    }
}