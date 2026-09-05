import request from "supertest";
import app from "../../../../src/app";
import { prisma } from "../../../../src/db/prisma";
import { ActorType, AwardSchemeType, FundingArea, LegalForm, Sector } from "@prisma/client";
import { Id } from "../../../../src/common/types/types";

const route = '/api/award-decisions';

type CreateAwardDecisionInput = {
    amount?: number;
    purpose?: string;
    sourceIdentifier?: string;
    decisionDate?: string | Date;
    awardSchemeId?: Id;
    decisionMakerId?: Id;
    recipientId?: Id;
    sourceDocumentId?: Id;
};

const createOrganizationActor = async (name: string): Promise<number> => {
    const organization = await prisma.organization.create({
        data: {
            name,
            legalForm: LegalForm.OTHER,
            sector: Sector.CIVIL,
            actor: {
                create: {
                    type: ActorType.ORGANIZATION,
                },
            },
        },
        include: {
            actor: true,
        },
    });

    return organization.actorId;
};

const createAwardScheme = async (): Promise<number> => {
    const organization = await prisma.organization.create({
        data: {
            name: `NKA_${Date.now()}`,
            legalForm: LegalForm.OTHER,
            sector: Sector.CIVIL,
            actor: {
                create: {
                    type: ActorType.ORGANIZATION,
                },
            },
        },
    });

    const scheme = await prisma.awardScheme.create({
        data: {
            name: "NKA laptámogatás",
            type: AwardSchemeType.GRANT,
            organizationId: organization.id,
            fundingArea: FundingArea.RECOGNITION,
        },
    });

    return scheme.id;
};

const createSourceDocument = async (): Promise<number> => {
    const document = await prisma.sourceDocument.create({
        data: {
            title: "NKA döntés 2024",
            url: `https://example.com/document-${Date.now()}.pdf`,
            retrievedAt: new Date("2024-01-01"),
        },
    });

    return document.id;
};

export const createAwardDecision = async (input: CreateAwardDecisionInput = {}) => {
    const suffix = crypto.randomUUID();

    const awardSchemeId = input.awardSchemeId ?? await createAwardScheme();

    const decisionMakerId = input.decisionMakerId ?? await createOrganizationActor(`Nemzeti Kulturális Alap-${suffix}`);
    const recipientId = input.recipientId ?? await createOrganizationActor(`Jelenkor Alapítvány-${suffix}`);
    
    const sourceDocumentId = input.sourceDocumentId ?? await createSourceDocument();

    return request(app)
        .post(route)
        .send({
            amount: input.amount ?? 1000000,
            purpose: input.purpose ?? 'Laptámogatás',
            sourceIdentifier: input.sourceIdentifier ?? 'NKA-2024-001',
            decisionDate: input.decisionDate ?? '2024-01-01',
            awardSchemeId,
            decisionMakerId,
            recipientId,
            sourceDocumentId,
        });
};

export const getAwardDecision = async (id: Id) =>
    request(app)
        .get(`${route}/${id}`);

export const updateAwardDecision = async (id: Id, data: object) =>
    request(app)
        .patch(`${route}/${id}`)
        .send(data);

export const deleteAwardDecision = async (id: Id) =>
    request(app)
        .delete(`${route}/${id}`);

export const deleteManyAwardDecisions = async (ids: Id[]) =>
    request(app)
        .delete(`${route}`)
        .send({ ids });

