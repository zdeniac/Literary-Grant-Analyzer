import z from "zod";
import { entityNameSchema, idSchema, nameSchema, yearSchema } from "../validation/schema";

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
