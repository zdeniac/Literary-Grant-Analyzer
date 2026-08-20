import z from "zod";
import { entityNameSchema, idSchema, nameSchema, yearSchema } from "../validation/schema";
import { AwardDecisionSearchableField, AwardDecisionSortableField } from "../../modules/award-decision/types/award-decision.types";
import { DecisionAuthoritySearchableField, DecisionAuthoritySortableField } from "../../modules/decision-authority/types/decision-authority.types";
import { AwardSchemeSearchableField, AwardSchemeSortableField } from "../../modules/award-scheme/types/award-scheme.types";
import { JournalSearchableField, JournalSortableField } from "../../modules/journal/types/journal.types";
import { OrganizationSearchableField, OrganizationSortableField } from "../../modules/organization/types/organization.types";
import { ImportJobSearchableField, ImportJobSortableField } from "../../modules/data-import/types/http.types";
import { SourceDocumentSearchableField, SourceDocumentSortableField } from "../../modules/source-document/types/source-document.types";
import { PersonSearchableField, PersonSortableField } from "../../modules/person/types/person.types";

declare global {
    namespace Express {
        interface Request {
            listQueryParams?: ListQueryParams;
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
    | PersonSortableField
    | SourceDocumentSortableField
;

export type SearchableField =
    | AwardDecisionSearchableField
    | AwardSchemeSearchableField
    | DecisionAuthoritySearchableField
    | JournalSearchableField
    | OrganizationSearchableField
    | ImportJobSearchableField
    | PersonSearchableField
    | SourceDocumentSearchableField
;

export type SearchQueryParams = {
    q: string;
    fields: SearchableField[];
}
export type ListOrder = 'ASC' | 'DESC';
export type ListQueryParams = {
    page?: number;
    perPage?: number;
    sort?: SortableField | string;
    order?: ListOrder;
    searchParams?: SearchQueryParams;
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
