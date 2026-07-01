import { describe, it, expect, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { LegalForm } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { Id } from "../../../src/common/types/types";
import { OrganizationDto } from "../../../src/modules/organization/dto/organization.dto";

describe('Decision body routes test', () => {

    const route = '/api/decision-bodies';
    const decisionBodyName = 'Szépirodalom Kollégium';

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createOrganization = async (): Promise<OrganizationDto> => {
        const res = await request(app)
            .post('/api/organizations')
            .send({
                name: 'Nemzeti Kulturális Alapítvány',
                legalForm: LegalForm.FOUNDATION
            });

        return res.body.data;
    };

    const createDecisionBody = async (
        overrides: Partial<{
            organizationId: Id;
            name: string;
        }> = {}
    ) => {
        const org = await createOrganization();

        return request(app)
            .post(route)
            .send({
                name: decisionBodyName,
                organizationId: org.id,
                ...overrides,
            });
    };

    const getDecisionBody = (id: Id) =>
        request(app)
            .get(`${route}/${id}`);

    const updateDecisionBody = (id: Id, data: object) =>
        request(app)
            .put(`${route}/${id}`)
            .send(data);

    const deleteDecisionBody = (id: Id) =>
        request(app)
            .delete(`${route}/${id}`);

    it('POST / creates decisionBody', async () => {
        const res = await createDecisionBody();

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe(decisionBodyName);
    });


    it('POST / rejects invalid payload', async () => {
        const res = await createDecisionBody({
            name: '',
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns decisionBody', async () => {
        const created = await createDecisionBody();

        const id = created.body.data.id;

        const res = await getDecisionBody(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id)
            .toBe(id);
    });

    it('PUT /:id updates decisionBody', async () => {
        const created = await createDecisionBody();

        const id = created.body.data.id;

        const res = await updateDecisionBody(id, {
            name: decisionBodyName,
            organizationId: created.body.data.organizationId,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name)
            .toBe(decisionBodyName);
    });

    it('PUT /:id rejects invalid payload', async () => {
        const created = await createDecisionBody();

        const res = await updateDecisionBody(
            created.body.data.id,
            {
                name: '',
            }
        );

        expect(res.status).toBe(400);
        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes decisionBody', async () => {
        const created = await createDecisionBody();
        const id = created.body.data.id;
        const res = await deleteDecisionBody(id);

        expect(res.status).toBe(204);

        const deleted = await getDecisionBody(id);

        expect(deleted.status)
            .toBe(404);
    });
});