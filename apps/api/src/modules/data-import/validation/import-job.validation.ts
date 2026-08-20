import z from "zod";
import { validSortableFields } from "../../../../../packages/shared/constants";

export const importJobSortableFieldSchema = z.enum(validSortableFields.importJob);