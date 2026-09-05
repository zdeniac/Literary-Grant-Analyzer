import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { AwardSchemeType, FundingArea } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { Name } from "../../../src/common/types/types";
import {
    createAwardScheme,
    CreateAwardSchemeInput,
    deleteAwardScheme,
    deleteManyAwardSchemes,
    getAwardScheme,
    updateAwardScheme,
} from "../helpers/api/award-scheme.api";
import { getAwardDecision } from "../helpers/api/award-decision.api";
import { HttpStatusCode } from "../../../src/common/http/status-codes";
import { expectNotFound } from "../helpers/error.helper";

describe('Award Scheme routes test', () => {

    const awardSchemeName: Name = 'Irodalmi laptámogatás';
    const awardSchemeType = AwardSchemeType.GRANT;

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createRouteAwardScheme = async (
        overrides: Partial<CreateAwardSchemeInput> = {}
    ) => {
        return createAwardScheme({
            name: overrides.name ?? awardSchemeName,
            type: overrides.type ?? awardSchemeType,
            fundingArea: overrides.fundingArea ?? FundingArea.CREATIVE_WORK,
            organizationId: overrides.organizationId,
        });
    };

    it('POST / creates award scheme', async () => {
        const res = await createRouteAwardScheme();

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.name).toBe(awardSchemeName);
    });

    it('POST / rejects invalid payload', async () => {
        let res = await createRouteAwardScheme({
            name: '',
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');

        res = await createRouteAwardScheme({
            type: 'd'
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns award scheme', async () => {
        const created = await createAwardScheme();

        const id = created.body.data.id;

        const res = await getAwardScheme(id);

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates award scheme', async () => {
        const created = await createAwardScheme();

        const id = created.body.data.id;

        const res = await updateAwardScheme(id, {
            name: 'teszt',
            type: AwardSchemeType.SCHOLARSHIP,
            organizationId: created.body.data.organizationId,
        });

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.name).toBe('teszt');
        expect(res.body.data.type).toBe('SCHOLARSHIP');
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createAwardScheme();

        const res = await updateAwardScheme(
            created.body.data.id,
            {
                name: '',
            }
        );

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes award scheme', async () => {
        const created = await createRouteAwardScheme();
        const id = created.body.data.id;
        const res = await deleteAwardScheme(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const deleted = await getAwardScheme(id);

        expect(deleted.status).toBe(HttpStatusCode.NOT_FOUND);
    });

    it('DELETE / deletes many award schemes', async () => {
        const created1 = await createRouteAwardScheme();
        const created2 = await createRouteAwardScheme();
        const created3 = await createRouteAwardScheme();

        const id1 = created1.body.data.id;
        const id2 = created2.body.data.id;
        const id3 = created3.body.data.id;

        const ids = [
            id1,
            id2,
            id3,
        ];

        const res = await deleteManyAwardSchemes(ids);

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.status).toBe(HttpStatusCode.OK);

        await expectNotFound(getAwardDecision(ids[0]));
        await expectNotFound(getAwardDecision(ids[1]));
        await expectNotFound(getAwardDecision(ids[2]));
    });
});