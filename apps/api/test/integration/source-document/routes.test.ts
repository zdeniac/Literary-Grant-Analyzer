import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { wipeDatabase } from "../helpers/db.helper";
import {
    createSourceDocument,
    deleteSourceDocument,
    getSourceDocument,
    updateSourceDocument,
} from "../helpers/api/source-document.api";

describe('SourceDocument routes test', () => {

    const createRouteSourceDocument = async (data: {
        title?: string;
        url?: string;
        retrievedAt?: string;
    } = {}) => {
        return createSourceDocument(data);
    };

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('POST / creates source document', async () => {
        const res = await createRouteSourceDocument();
        expect(res.status).toBe(200);
        expect(res.body.data.title)
            .toBe('NKA döntés 2024');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createRouteSourceDocument({
            title: '',
            url: 'invalid-url',
        });

        expect(res.status).toBe(422);
        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns source document', async () => {
        const created = await createSourceDocument();

        const id = created.body.data.id;

        const res = await getSourceDocument(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id)
            .toBe(id);
    });

    it('PATCH /:id updates source document', async () => {
        const created = await createSourceDocument();

        const id = created.body.data.id;

        const res = await updateSourceDocument(id, {
            title: 'NKA döntés 2025',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.title)
            .toBe('NKA döntés 2025');
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createSourceDocument();

        const res = await updateSourceDocument(
            created.body.data.id,
            {
                url: 'invalid-url',
            }
        );

        expect(res.status).toBe(422);
        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes source document', async () => {
        const created = await createSourceDocument();

        const id = created.body.data.id;

        const res = await deleteSourceDocument(id);

        expect(res.status).toBe(204);

        const deleted = await getSourceDocument(id);

        expect(deleted.status)
            .toBe(404);
    });
});