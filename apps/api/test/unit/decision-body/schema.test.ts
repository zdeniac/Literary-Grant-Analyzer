import { describe, expect, it } from "vitest";
import { decisionBodySchema } from "../../../src/modules/decision-body/validation/decision-body.schema"; 

describe('Decision Body schema integration', () => {
    it('accepts valid decision body', async () => {
        const input = {
            name: 'Valid decision',
            organizationId: 12,
        };

        const parsed = decisionBodySchema.parse(input);

        expect(parsed).toEqual(input);
    });

    it('rejects invalid name', () => {
        expect(() =>
            decisionBodySchema.parse({
                name: '',
                organizationId: '123',
            })
        ).toThrow();
    });
});