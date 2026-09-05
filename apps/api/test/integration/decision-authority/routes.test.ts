import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { ActorType } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import {
    createDecisionAuthority,
    deleteDecisionAuthority,
    deleteManyDecisionAuthorities,
    getDecisionAuthority,
    updateDecisionAuthority,
} from "../helpers/api/decision-authority.api";
import { createOrganization } from "../helpers/api/organization.api";
import { HttpStatusCode } from "../../../src/common/http/status-codes";
import { expectNotFound } from "../helpers/error.helper";

describe('Decision body routes test', () => {
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const decisionAuthorityName = 'Szépirodalom Kollégium';

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

    it('POST / creates decision authority', async () => {
        const res = await createDecisionAuthority();

        expect(res.status).toBe(HttpStatusCode.OK);
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

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns decision authority', async () => {
        const created = await createDecisionAuthority();

        const id = created.body.data.id;

        const res = await getDecisionAuthority(id);

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates decision authority', async () => {
        const created = await createRouteDecisionAuthority();
        const org = await createOrganization({ name: 'NKA' });

        const id = created.body.data.id;
        const orgId = org.body.data.id;

        const res = await updateDecisionAuthority(id, {
            name: 'asd',
            organizationId: orgId,
        });

        expect(res.status).toBe(HttpStatusCode.OK);
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

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes decision authority', async () => {
        const created = await createDecisionAuthority();
        const id = created.body.data.id;
        const res = await deleteDecisionAuthority(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const deleted = await getDecisionAuthority(id);

        expect(deleted.status).toBe(HttpStatusCode.NOT_FOUND);
    });

    it('DELETE /:id deletes actor', async () => {
        const created = await createDecisionAuthority();
        const id = created.body.data.id;

        const decisionAuthority = await prisma.decisionAuthority.findUniqueOrThrow({
            where: { id },
        });

        await deleteDecisionAuthority(id);

        const actor = await prisma.actor.findUnique({
            where: { id: decisionAuthority.actorId },
        });

        expect(actor).toBeNull();
    });

    it('DELETE / deletes many decision authorities', async () => {
        const created1 = await createDecisionAuthority();
        const created2 = await createDecisionAuthority();
        const created3 = await createDecisionAuthority();

        const id1 = created1.body.data.id;
        const id2 = created2.body.data.id;
        const id3 = created3.body.data.id;

        const ids = [
            id1,
            id2,
            id3,
        ];

        const res = await deleteManyDecisionAuthorities(ids);

        expect(res.status).toBe(HttpStatusCode.OK);

        await expectNotFound(getDecisionAuthority(ids[0]));
        await expectNotFound(getDecisionAuthority(ids[1]));
        await expectNotFound(getDecisionAuthority(ids[2]));
    });
});