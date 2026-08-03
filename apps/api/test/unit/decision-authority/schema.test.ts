import { describe, expect, it } from "vitest";
import {
    createDecisionAuthorityInputSchema,
    createDecisionAuthoritySchema,
    decisionAuthoritySchema,
    importDecisionAuthoritySchema,
    updateDecisionAuthoritySchema,
} from "../../../src/modules/decision-authority/validation/decision-authority.schema";

const validDecisionAuthority = {
    id: 1,
    name: 'Valid decision',
    organizationId: 12,
    actorId: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('Decision Body schema test', () => {
    it('accepts valid decision body', () => {
        const parsed = decisionAuthoritySchema.parse(validDecisionAuthority);

        expect(parsed).toEqual({
            ...validDecisionAuthority,
            createdAt: new Date(validDecisionAuthority.createdAt),
            updatedAt: new Date(validDecisionAuthority.updatedAt),
        });
    });

    it('rejects invalid name', () => {
        expect(() =>
            decisionAuthoritySchema.parse({
                ...validDecisionAuthority,
                name: '',
            })
        ).toThrow();
    });

    it('accepts a create payload without id and timestamps', () => {
        const payload = {
            name: 'New decision body',
            organizationId: 12,
            actorId: 3,
        };

        const parsed = createDecisionAuthoritySchema.parse(payload);

        expect(parsed).toEqual(payload);
    });

    it('requires organizationId for create input schema', () => {
        expect(() =>
            createDecisionAuthorityInputSchema.parse({
                name: 'New decision body',
            })
        ).toThrow();
    });

    it('allows partial updates', () => {
        const parsed = updateDecisionAuthoritySchema.parse({
            name: 'Updated decision body',
        });

        expect(parsed).toEqual({
            name: 'Updated decision body',
        });
    });

    it('accepts import payloads with organizationName', () => {
        const parsed = importDecisionAuthoritySchema.parse({
            name: 'Imported decision body',
            organizationName: 'Example Org',
        });

        expect(parsed).toEqual({
            name: 'Imported decision body',
            organizationName: 'Example Org',
        });
    });
});