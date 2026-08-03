import { importableModelSchema, ImportableModel } from "../constants/importable-models";
import z from "zod";

export const modelNameSchema = z
    .string()
    .regex(
        /^[a-z][a-zA-Z0-9]*$/,
        "Model's name must be camelCase"
    );

export { importableModelSchema, ImportableModel };
