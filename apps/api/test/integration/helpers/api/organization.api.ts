import request from "supertest";
import app from "../../../../src/app";
import { Id } from "../../../../src/common/types/types";
import { LegalForm, Sector } from "@prisma/client";

const route = "/api/organizations";

export const createOrganization = async (input: {
    name?: string;
    legalForm?: LegalForm;
    sector?: Sector;
    address?: string;
    foundingYear?: number;
} = {}) => {
    return request(app)
        .post(route)
        .send({
            name: input.name ?? 'Tiszatáj Alapítvány',
            legalForm: input.legalForm ?? LegalForm.FOUNDATION,
            sector: input.sector ?? Sector.CIVIL,
            address: input.address,
            foundingYear: input.foundingYear,
        });
};

export const getOrganization = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updateOrganization = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deleteOrganization = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);
