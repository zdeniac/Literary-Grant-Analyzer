import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { ActorType } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import {
    createDecisionBody,
    deleteDecisionBody,
    getDecisionBody,
    updateDecisionBody,
} from "../helpers/api/decision-body.api";
import { createOrganization } from "../helpers/api/organization.api";

describe('Decision body routes test', () => {

    const decisionBodyName = 'Szépirodalom Kollégium';

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createRouteDecisionBody = async (
        overrides: Partial<{
            organizationId: number;
            name: string;
        }> = {}
    ) => {
        return createDecisionBody({
            name: overrides.name ?? decisionBodyName,
            organizationId: overrides.organizationId,
        });
    };

    it('POST / creates decisionBody', async () => {
        const res = await createDecisionBody();

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe(decisionBodyName);
    });

    it('POST / creates actor', async () => {
        const res = await createDecisionBody();

        const decisionBody = await prisma.decisionBody.findUniqueOrThrow({
            where: { id: res.body.data.id },
        });

        const actor = await prisma.actor.findUnique({
            where: { id: decisionBody.actorId },
        });

        expect(actor).not.toBeNull();
        expect(actor?.type).toBe(ActorType.DECISION_BODY)
    });


    it('POST / rejects invalid payload', async () => {
        const res = await createRouteDecisionBody({
            name: '',
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns decisionBody', async () => {
        const created = await createDecisionBody();

        const id = created.body.data.id;

        const res = await getDecisionBody(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates decisionBody', async () => {
        const created = await createRouteDecisionBody();
        const org = await createOrganization({ name: 'NKA' });

        const id = created.body.data.id;
        const orgId = org.body.data.id;

        const res = await updateDecisionBody(id, {
            name: 'asd',
            organizationId: orgId,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('asd');
        expect(res.body.data.organizationId).toBe(orgId);
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createDecisionBody();

        const res = await updateDecisionBody(
            created.body.data.id,
            {
                name: '',
            }
        );

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes decisionBody', async () => {
        const created = await createDecisionBody();
        const id = created.body.data.id;
        const res = await deleteDecisionBody(id);

        expect(res.status).toBe(204);

        const deleted = await getDecisionBody(id);

        expect(deleted.status).toBe(404);
    });

    it('DELETE /:id deletes actor', async () => {
        const created = await createDecisionBody();
        const id = created.body.data.id;

        const decisionBody = await prisma.decisionBody.findUniqueOrThrow({
            where: { id },
        });

        const res = await deleteDecisionBody(id);

        const actor = await prisma.actor.findUnique({
            where: { id: decisionBody.actorId },
        });

        expect(actor).toBeNull();
    });

});