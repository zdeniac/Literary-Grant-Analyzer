import { describe, it, expect, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { AwardSchemeType, LegalForm } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { Id, Name } from "../../../src/common/types/types";
import { OrganizationDto } from "../../../src/modules/organization/dto/organization.dto";

describe('Award scheme routes test', () => {

    const route = '/api/award-schemes';
    const awardSchemeName: Name = 'Irodalmi laptámogatás';
    const awardSchemeType = AwardSchemeType.GRANT;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createOrganization = async (data: { name: Name }): Promise<OrganizationDto> => {
        const res = await request(app)
            .post('/api/organizations')
            .send({
                name: data.name,
                legalForm: LegalForm.FOUNDATION
            });

        return res.body.data;
    };

    const createAwardScheme = async (
        overrides: Partial<{
            name: string;
            type: AwardSchemeType | string;
            organizationId: Id;
        }> = {}
    ) => {
        const org = await createOrganization({ name: 'NKA' + Date.now().toString() });
        return request(app)
            .post(route)
            .send({
                name: awardSchemeName,
                type: awardSchemeType,
                organizationId: org.id,
                ...overrides,
            });
    };

    const getAwardScheme = (id: Id) =>
        request(app)
            .get(`${route}/${id}`);

    const updateAwardScheme = (id: Id, data: object) =>
        request(app)
            .put(`${route}/${id}`)
            .send(data);

    const deleteAwardScheme = (id: Id) =>
        request(app)
            .delete(`${route}/${id}`);

    it('POST / creates Award Scheme', async () => {
        const res = await createAwardScheme();

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe(awardSchemeName);
    });

    it('POST / rejects invalid payload', async () => {
        let res = await createAwardScheme({
            name: '',
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');

        res = await createAwardScheme({
            type: 'd'
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns awardScheme', async () => {
        const created = await createAwardScheme();

        const id = created.body.data.id;

        const res = await getAwardScheme(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('PUT /:id updates awardScheme', async () => {
        const created = await createAwardScheme();

        const id = created.body.data.id;

        const res = await updateAwardScheme(id, {
            name: 'teszt',
            type: AwardSchemeType.SCHOLARSHIP,
            organizationId: created.body.data.organizationId,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('teszt');
        expect(res.body.data.type).toBe('SCHOLARSHIP');
    });

    it('PUT /:id rejects invalid payload', async () => {
        const created = await createAwardScheme();

        const res = await updateAwardScheme(
            created.body.data.id,
            {
                name: '',
            }
        );

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes decisionBody', async () => {
        const created = await createAwardScheme();
        const id = created.body.data.id;
        const res = await deleteAwardScheme(id);

        expect(res.status).toBe(204);

        const deleted = await getAwardScheme(id);

        expect(deleted.status).toBe(404);
    });
});