import z from "zod";
import { idSchema, nameSchema, yearSchema } from "../../../common/validation/schema";
import { PersonRole } from "@prisma/client";

export const personSortableFieldSchema = z.enum([
    'id',
    'name',
    'birthYear',
    'deathYear',
]);

export const personSchema = z.object({
    id: idSchema,

    name: nameSchema,
    birthYear: yearSchema.nullable().default(null),
    deathYear: yearSchema.nullable().default(null),

    roles: z.array(z.enum(PersonRole)),

    actorId: idSchema,

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createPersonSchema = personSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        actorId: true,
    });

export const createPersonWithActorIdSchema = createPersonSchema
    .extend({
        actorId: idSchema,
    });
    
export const updatePersonSchema = createPersonSchema.partial();