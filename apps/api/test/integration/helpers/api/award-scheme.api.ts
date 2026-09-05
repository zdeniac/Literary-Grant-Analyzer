import request from "supertest";
import app from "../../../../src/app";
import { AwardSchemeType, FundingArea } from "@prisma/client";
import { Id } from "../../../../src/common/types/types";
import { createOrganization } from "./organization.api";

const route = "/api/award-schemes";

export type CreateAwardSchemeInput = {
    name?: string;
    type?: AwardSchemeType | string;
    organizationId?: Id;
    fundingArea?: FundingArea | string;
};

export const createAwardScheme = async (input: CreateAwardSchemeInput = {}) => {
    const organizationId = input.organizationId
        ?? (await createOrganization({ name: `NKA_${Date.now()}` })).body.data.id;

    return request(app)
        .post(route)
        .send({
            name: input.name ?? 'Esemény',
            type: input.type ?? AwardSchemeType.AWARD,
            fundingArea: input.fundingArea ?? FundingArea.EVENT,
            organizationId,
        });
};

export const getAwardScheme = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updateAwardScheme = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deleteAwardScheme = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);

export const deleteManyAwardSchemes = async (ids: Id[]) =>
    request(app)
        .delete(`${route}`)
        .send({ ids });

