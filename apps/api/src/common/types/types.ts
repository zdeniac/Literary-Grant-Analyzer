import z from "zod";
import { entityNameSchema, idSchema, nameSchema, yearSchema } from "../validation/schema";
import { AwardDecisionSortableField } from "../../modules/award-decision/types/award-decision.types";
import { DecisionAuthoritySortableField } from "../../modules/decision-authority/types/decision-authority.types";
import { AwardSchemeSortableField } from "../../modules/award-scheme/types/award-scheme.types";
import { JournalSortableField } from "../../modules/journal/types/journal.types";
import { OrganizationSortableField } from "../../modules/organization/types/organization.types";
import { ImportJobSortableField } from "../../modules/data-import/types/http.types";
import { SourceDocumentSortableField } from "../../modules/source-document/types/source-document.types";
import { PersonSortableField } from "../../modules/person/types/person.types";

declare global {
    namespace Express {
        interface Request {
            listQueryParams?: ListQueryParams<SortableField | string>;
        }
    }
}
export type SortableField = 
    | AwardDecisionSortableField
    | AwardSchemeSortableField
    | DecisionAuthoritySortableField
    | JournalSortableField
    | OrganizationSortableField
    | ImportJobSortableField
    | SourceDocumentSortableField
    | PersonSortableField
;

export type ListOrder = 'ASC' | 'DESC';
export type ListQueryParams<TField extends string = string> = {
    page?: number;
    perPage?: number;
    sort?: TField;
    order?: ListOrder;
    filter?: Record<string, unknown>;
};

export type Id = z.infer<typeof idSchema>;
export type IdParam = Id;

export type Year = z.infer<typeof yearSchema>;
export type Name = z.infer<typeof nameSchema>;
export type EntityName = z.infer<typeof entityNameSchema>;

export type DtoMapper<TEntity, TDto> = (entity: TEntity) => TDto;

export interface CrudServiceInterface<TEntity, TCreateDto, TUpdateDto = Partial<TCreateDto>>
{
    create(dto: TCreateDto): Promise<TEntity>;
    findById(id: Id): Promise<TEntity>;
    findAll(): Promise<TEntity[]>;
    update(id: Id, dto: TUpdateDto): Promise<TEntity>;
    delete(id: Id): Promise<TEntity>;
}
