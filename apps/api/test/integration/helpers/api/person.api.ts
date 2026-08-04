import request from "supertest";
import app from "../../../../src/app";
import { Id } from "../../../../src/common/types/types";
import { PersonRole } from "@prisma/client";

const route = "/api/persons";

type CreatePersonInput = {
    name?: string;
    birthYear?: number;
    deathYear?: number;
    roles?: PersonRole[];
};

export const createPerson = async (input: CreatePersonInput = {}) =>
    request(app)
        .post(route)
        .send({
            name: input.name ?? 'John Doe',
            birthYear: input.birthYear,
            deathYear: input.deathYear,
            roles: input.roles ?? [PersonRole.AUTHOR],
        });

export const getPerson = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updatePerson = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deletePerson = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);