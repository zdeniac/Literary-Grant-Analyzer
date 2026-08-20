import z from "zod";
import { validSearchableFields, validSortableFields } from "../../../../../packages/shared/constants";

export const importJobSortableFieldSchema = z.enum(validSortableFields.importJob);
export const importJobSearchableFieldSchema = z.enum(validSearchableFields.importJob);