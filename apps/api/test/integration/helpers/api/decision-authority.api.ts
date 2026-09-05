import request from "supertest";
import app from "../../../../src/app";
import { Id } from "../../../../src/common/types/types";
import { createOrganization } from "./organization.api";

const route = "/api/decision-authorities";

type CreateDecisionAuthorityInput = {
    name?: string;
    organizationId?: Id;
};

export const createDecisionAuthority = async (input: CreateDecisionAuthorityInput = {}) => {
    const organizationId = input.organizationId
        ?? (await createOrganization({ name: `NKA_${Date.now()}` })).body.data.id;

    return request(app)
        .post(route)
        .send({
            name: input.name ?? 'Szépirodalom Kollégium',
            organizationId,
        });
};

export const getDecisionAuthority = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updateDecisionAuthority = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deleteDecisionAuthority = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);

export const deleteManyDecisionAuthorities = async (ids: Id[]) =>
    request(app)
        .delete(`${route}`)
        .send({ ids });
