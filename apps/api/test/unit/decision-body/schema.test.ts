import { describe, expect, it } from "vitest";
import {
    createDecisionBodyInputSchema,
    createDecisionBodySchema,
    decisionBodySchema,
    importDecisionBodySchema,
    updateDecisionBodySchema,
} from "../../../src/modules/decision-body/validation/decision-body.schema";

const validDecisionBody = {
    id: 1,
    name: 'Valid decision',
    organizationId: 12,
    actorId: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('Decision Body schema test', () => {
    it('accepts valid decision body', () => {
        const parsed = decisionBodySchema.parse(validDecisionBody);

        expect(parsed).toEqual({
            ...validDecisionBody,
            createdAt: new Date(validDecisionBody.createdAt),
            updatedAt: new Date(validDecisionBody.updatedAt),
        });
    });

    it('rejects invalid name', () => {
        expect(() =>
            decisionBodySchema.parse({
                ...validDecisionBody,
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

        const parsed = createDecisionBodySchema.parse(payload);

        expect(parsed).toEqual(payload);
    });

    it('requires organizationId for create input schema', () => {
        expect(() =>
            createDecisionBodyInputSchema.parse({
                name: 'New decision body',
            })
        ).toThrow();
    });

    it('allows partial updates', () => {
        const parsed = updateDecisionBodySchema.parse({
            name: 'Updated decision body',
        });

        expect(parsed).toEqual({
            name: 'Updated decision body',
        });
    });

    it('accepts import payloads with organizationName', () => {
        const parsed = importDecisionBodySchema.parse({
            name: 'Imported decision body',
            organizationName: 'Example Org',
        });

        expect(parsed).toEqual({
            name: 'Imported decision body',
            organizationName: 'Example Org',
        });
    });
});