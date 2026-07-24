import z from "zod";

export const modelNameSchema = z
    .string()
    .regex(
        /^[a-z][a-zA-Z0-9]*$/, 
        'ModelName must be camelCase'
    );
