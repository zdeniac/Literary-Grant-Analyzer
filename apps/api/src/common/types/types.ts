import z from "zod";
import { idSchema, nameSchema, yearSchema } from "../validation/schema";

export type Id = z.infer<typeof idSchema>;
export type IdParam = Id;

export type Year = z.infer<typeof yearSchema>;
export type Name = z.infer<typeof nameSchema>;

export type DtoMapper<TModel, TDto> = (model: TModel) => TDto;

export interface CrudServiceInterface<TModel, TCreateDto, TUpdateDto>
{
    create(dto: TCreateDto): Promise<TModel>;
    findById(id: Id): Promise<TModel>;
    findAll(): Promise<TModel[]>;
    update(id: Id, dto: TUpdateDto): Promise<TModel>;
    delete(id: Id): Promise<TModel>;
}
