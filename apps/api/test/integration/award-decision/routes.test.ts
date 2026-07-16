import { describe, it, expect, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import { ActorType, AwardSchemeType, LegalForm } from "@prisma/client";

describe('AwardDecision routes test', () => {

    const route = '/api/award-decisions';

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createActor = async (): Promise<number> => {
        const actor = await prisma.actor.create({
            data: {
                type: ActorType.ORGANIZATION,
            }
        });

        return actor.id;
    };

    const createAwardScheme = async (): Promise<number> => {
        const organization = await prisma.organization.create({
            data: {
                name: `NKA_${Date.now()}`,
                legalForm: LegalForm.OTHER,
                actor: {
                    create: {
                        type: ActorType.ORGANIZATION,
                    }
                }
            }
        });

        const scheme = await prisma.awardScheme.create({
            data: {
                name: 'NKA laptámogatás',
                type: AwardSchemeType.GRANT,
                organizationId: organization.id,
            }
        });

        return scheme.id;
    };

    const createSourceDocument = async (): Promise<number> => {
        const document = await prisma.sourceDocument.create({
            data: {
                title: 'NKA döntés 2024',
                url: `https://example.com/document-${Date.now()}.pdf`,
                retrievedAt: new Date('2024-01-01'),
            }
        });

        return document.id;
    };

    const createAwardDecision = async (
        data: Partial<{
            amount: number;
            purpose: string;
            decisionDate?: string | Date;
        }> = {}
    ): Promise<request.Response> => {

        const awardSchemeId = await createAwardScheme();
        const decisionMakerId = await createActor();
        const recipientId = await createActor();
        const sourceDocumentId = await createSourceDocument();

        return request(app)
            .post(route)
            .send({
                amount: data.amount ?? 1000000,
                purpose: data.purpose ?? 'Laptámogatás',
                sourceIdentifier: 'NKA-2024-001',
                decisionDate: data?.decisionDate ?? '2024-01-01',

                awardSchemeId,
                decisionMakerId,
                recipientId,
                sourceDocumentId,
            });
    };

    const getAwardDecision = (id: number) =>
        request(app)
            .get(`${route}/${id}`);

    const updateAwardDecision = (
        id: number,
        data: object
    ) =>
        request(app)
            .patch(`${route}/${id}`)
            .send(data);


    const deleteAwardDecision = (id: number) =>
        request(app)
            .delete(`${route}/${id}`);

    it('POST / creates award decision', async () => {
        const res = await createAwardDecision();

        expect(res.status).toBe(200);
        expect(res.body.data.purpose)
            .toBe('Laptámogatás');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createAwardDecision({
            decisionDate: '',
        });

        expect(res.status).toBe(422);
        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns award decision', async () => {
        const created = await createAwardDecision();

        const id = created.body.data.id;

        const res = await getAwardDecision(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id)
            .toBe(id);
    });

    it('PATCH /:id updates award decision', async () => {
        const created = await createAwardDecision();

        const id = created.body.data.id;

        const res = await updateAwardDecision(id, {
            purpose: 'Módosított cél',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.purpose)
            .toBe('Módosított cél');
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createAwardDecision();

        const res = await updateAwardDecision(
            created.body.data.id,
            {
                decisionDate: 'invalid-date',
            }
        );

        expect(res.status).toBe(422);
        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes award decision', async () => {
        const created = await createAwardDecision();

        const id = created.body.data.id;

        const res = await deleteAwardDecision(id);

        expect(res.status).toBe(204);

        const deleted = await getAwardDecision(id);

        expect(deleted.status)
            .toBe(404);
    });

});