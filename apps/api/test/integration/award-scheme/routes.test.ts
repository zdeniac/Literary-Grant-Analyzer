import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { AwardSchemeType, FundingArea } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { Name } from "../../../src/common/types/types";
import {
    createAwardScheme,
    CreateAwardSchemeInput,
    deleteAwardScheme,
    getAwardScheme,
    updateAwardScheme,
} from "../helpers/api/award-scheme.api";

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

    it('POST / creates Award Scheme', async () => {
        const res = await createRouteAwardScheme();

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe(awardSchemeName);
    });

    it('POST / rejects invalid payload', async () => {
        let res = await createRouteAwardScheme({
            name: '',
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');

        res = await createRouteAwardScheme({
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

    it('PATCH /:id updates awardScheme', async () => {
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

    it('PATCH /:id rejects invalid payload', async () => {
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
        const created = await createRouteAwardScheme();
        const id = created.body.data.id;
        const res = await deleteAwardScheme(id);

        expect(res.status).toBe(204);

        const deleted = await getAwardScheme(id);

        expect(deleted.status).toBe(404);
    });
});