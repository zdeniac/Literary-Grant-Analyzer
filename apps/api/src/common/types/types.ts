import z from "zod";
import { idSchema, yearSchema } from "../validation/schema";

export type Id = z.infer<typeof idSchema>;
export type IdParam = Id;

export type Year = z.infer<typeof yearSchema>;

export type Mapper<TModel, TDto> = (entity: TModel) => TDto;

export interface CrudService<TModel, TCreate = unknown, TUpdate = unknown> {
    findById(id: Id): Promise<TModel>;
    findAll(): Promise<TModel[]>;
    create(data: TCreate): Promise<TModel>;
    update(id: Id, data: TUpdate): Promise<TModel>;
    delete(id: Id): Promise<void>;
};