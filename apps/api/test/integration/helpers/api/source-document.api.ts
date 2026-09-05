import request from "supertest";
import app from "../../../../src/app";
import { Id } from "../../../../src/common/types/types";

const route = "/api/source-documents";

type CreateSourceDocumentInput = {
    title?: string;
    url?: string;
    issuingOrganizationId?: Id;
    retrievedAt?: string;
};

export const createSourceDocument = async (input: CreateSourceDocumentInput = {}) => {
    return request(app)
        .post(route)
        .send({
            title: input.title ?? 'NKA döntés 2024',
            url: input.url ?? `https://example.com/document-${Date.now()}.pdf`,
            issuingOrganizationId: input.issuingOrganizationId ?? null,
            retrievedAt: input.retrievedAt ?? '2024-01-01 10:20:00',
        });
};

export const getSourceDocument = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updateSourceDocument = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deleteSourceDocument = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);

export const deleteManySourceDocuments = async (ids: Id[]) =>
    request(app)
        .delete(`${route}`)
        .send({ ids });
