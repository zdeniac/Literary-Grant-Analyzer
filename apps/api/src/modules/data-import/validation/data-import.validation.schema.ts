import { importableEntityNameSchema, ImportableEntityName } from "../constants/importable-models";
import z from "zod";

export const entityNameSchema = z
    .string()
    .regex(
        /^[a-z][a-zA-Z0-9]*$/,
        "The entity's name must be camelCase"
    );

export { importableEntityNameSchema, type ImportableEntityName };
