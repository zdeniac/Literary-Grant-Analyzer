import request from "supertest";
import app from "../../../../src/app";
import { JournalFormat, JournalStatus } from "@prisma/client";
import { Id } from "../../../../src/common/types/types";
import { createOrganization } from "./organization.api";
import { Issn } from "../../../../src/modules/journal/types/journal.types";

const route = "/api/journals";

type CreateJournalInput = {
    name?: string;
    status?: JournalStatus | string;
    foundingYear?: number;
    format?: JournalFormat[];
    issn?: Issn;
    affiliations?: Array<{
        organizationId: Id;
        fromYear?: number | null;
        toYear?: number | null;
        note?: string | null;
        isCurrent?: boolean;
        sourceDocumentId?: Id | null;
    }>;
};

export const createJournal = async (input: CreateJournalInput = {}) => {
    const organization = await createOrganization({
        name: `Tiszatáj Alapítvány_${Date.now()}`,
    });

    const organizationId = input.affiliations?.[0]?.organizationId ?? organization.body.data.id;
    const affiliations = input.affiliations ?? [{
        organizationId,
        fromYear: 2000,
        toYear: 2020,
        note: "Test affiliation",
        isCurrent: true,
    }];

    return request(app)
        .post(route)
        .send({
            name: input.name ?? 'Tiszatáj',
            status: input.status ?? JournalStatus.ACTIVE,
            foundingYear: input.foundingYear ?? 1980,
            format: input.format ?? [JournalFormat.PRINT, JournalFormat.ONLINE],
            issn: input.issn ?? '12345683',
            affiliations,
        });
};

export const getJournal = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updateJournal = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deleteJournal = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);

export const deleteManyJournals = async (ids: Id[]) =>
    request(app)
        .delete(`${route}`)
        .send({ ids });
