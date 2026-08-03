import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { ActorType } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import {
    createDecisionAuthority,
    deleteDecisionAuthority,
    getDecisionAuthority,
    updateDecisionAuthority,
} from "../helpers/api/decision-authority.api";
import { createOrganization } from "../helpers/api/organization.api";

describe('Decision body routes test', () => {

    const decisionAuthorityName = 'Szépirodalom Kollégium';

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createRouteDecisionAuthority = async (
        overrides: Partial<{
            organizationId: number;
            name: string;
        }> = {}
    ) => {
        return createDecisionAuthority({
            name: overrides.name ?? decisionAuthorityName,
            organizationId: overrides.organizationId,
        });
    };

    it('POST / creates decisionAuthority', async () => {
        const res = await createDecisionAuthority();

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe(decisionAuthorityName);
    });

    it('POST / creates actor', async () => {
        const res = await createDecisionAuthority();

        const decisionAuthority = await prisma.decisionAuthority.findUniqueOrThrow({
            where: { id: res.body.data.id },
        });

        const actor = await prisma.actor.findUnique({
            where: { id: decisionAuthority.actorId },
        });

        expect(actor).not.toBeNull();
        expect(actor?.type).toBe(ActorType.DECISION_AUTHORITY)
    });


    it('POST / rejects invalid payload', async () => {
        const res = await createRouteDecisionAuthority({
            name: '',
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns decisionAuthority', async () => {
        const created = await createDecisionAuthority();

        const id = created.body.data.id;

        const res = await getDecisionAuthority(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates decisionAuthority', async () => {
        const created = await createRouteDecisionAuthority();
        const org = await createOrganization({ name: 'NKA' });

        const id = created.body.data.id;
        const orgId = org.body.data.id;

        const res = await updateDecisionAuthority(id, {
            name: 'asd',
            organizationId: orgId,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('asd');
        expect(res.body.data.organizationId).toBe(orgId);
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createDecisionAuthority();

        const res = await updateDecisionAuthority(
            created.body.data.id,
            {
                name: '',
            }
        );

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes decisionAuthority', async () => {
        const created = await createDecisionAuthority();
        const id = created.body.data.id;
        const res = await deleteDecisionAuthority(id);

        expect(res.status).toBe(204);

        const deleted = await getDecisionAuthority(id);

        expect(deleted.status).toBe(404);
    });

    it('DELETE /:id deletes actor', async () => {
        const created = await createDecisionAuthority();
        const id = created.body.data.id;

        const decisionAuthority = await prisma.decisionAuthority.findUniqueOrThrow({
            where: { id },
        });

        const res = await deleteDecisionAuthority(id);

        const actor = await prisma.actor.findUnique({
            where: { id: decisionAuthority.actorId },
        });

        expect(actor).toBeNull();
    });

});