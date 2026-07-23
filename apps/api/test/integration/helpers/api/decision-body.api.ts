import request from "supertest";
import app from "../../../../src/app";
import { Id } from "../../../../src/common/types/types";
import { createOrganization } from "./organization.api";

const route = "/api/decision-bodies";

type CreateDecisionBodyInput = {
    name?: string;
    organizationId?: Id;
};

export const createDecisionBody = async (input: CreateDecisionBodyInput = {}) => {
    const organizationId = input.organizationId
        ?? (await createOrganization({ name: `NKA_${Date.now()}` })).body.data.id;

    return request(app)
        .post(route)
        .send({
            name: input.name ?? 'Szépirodalom Kollégium',
            organizationId,
        });
};

export const getDecisionBody = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updateDecisionBody = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deleteDecisionBody = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);
