import z from "zod";
import { idSchema, nameSchema, yearSchema } from "../validation/schema";

export type Id = z.infer<typeof idSchema>;
export type IdParam = Id;

export type Year = z.infer<typeof yearSchema>;
export type Name = z.infer<typeof nameSchema>;

export type DtoMapper<TModel, TDto> = (entity: TModel) => TDto;
