import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { wipeDatabase } from "../helpers/db.helper";
import {
    createSourceDocument,
    deleteManySourceDocuments,
    deleteSourceDocument,
    getSourceDocument,
    updateSourceDocument,
} from "../helpers/api/source-document.api";
import { HttpStatusCode } from "../../../src/common/http/status-codes";
import { expectNotFound } from "../helpers/error.helper";
import { Id } from "../../../src/common/types/types";

describe('SourceDocument routes test', () => {
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createRouteSourceDocument = async (data: {
        title?: string;
        url?: string;
        retrievedAt?: string;
        issuingOrganizationId?: Id;
    } = {}) => {
        return createSourceDocument(data);
    };

    it('POST / creates source document', async () => {
        const res = await createRouteSourceDocument();

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.title).toBe('NKA döntés 2024');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createRouteSourceDocument({
            title: '',
            url: 'invalid-url',
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns source document', async () => {
        const created = await createSourceDocument();

        const id = created.body.data.id;

        const res = await getSourceDocument(id);

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates source document', async () => {
        const created = await createSourceDocument();

        const id = created.body.data.id;

        const res = await updateSourceDocument(id, {
            title: 'NKA döntés 2025',
        });

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.title).toBe('NKA döntés 2025');
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createSourceDocument();

        const res = await updateSourceDocument(
            created.body.data.id,
            {
                url: 'invalid-url',
            }
        );

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes source document', async () => {
        const created = await createSourceDocument();

        const id = created.body.data.id;

        const res = await deleteSourceDocument(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const deleted = await getSourceDocument(id);

        expect(deleted.status).toBe(HttpStatusCode.NOT_FOUND);
    });

    it('DELETE / deletes many source documents', async () => {
        const created1 = await createSourceDocument();
        const created2 = await createSourceDocument();
        const created3 = await createSourceDocument();

        const id1 = created1.body.data.id;
        const id2 = created2.body.data.id;
        const id3 = created3.body.data.id;

        const ids = [
            id1,
            id2,
            id3,
        ];

        const res = await deleteManySourceDocuments(ids);
        console.log(res);
        expect(res.status).toBe(HttpStatusCode.OK);

        await expectNotFound(getSourceDocument(ids[0]));
        await expectNotFound(getSourceDocument(ids[1]));
        await expectNotFound(getSourceDocument(ids[2]));
    });
});