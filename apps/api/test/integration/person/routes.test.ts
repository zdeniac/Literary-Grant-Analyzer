import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { ActorType } from "@prisma/client";
import { PersonRole } from "../../../../packages/shared/enums";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import {
    createPerson,
    deletePerson,
    getPerson,
    updatePerson,
} from "../helpers/api/person.api";

describe('Person routes test', () => {

    const createRoutePerson = async (
        overrides: Partial<{
            name: string;
            birthYear: number;
            deathYear: number;
            roles: PersonRole[];
        }> = {}
    ) => createPerson({
        ...overrides,
    });

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('POST / creates person', async () => {
        const res = await createRoutePerson({
            name: 'Kiss Béla',
            roles: [PersonRole.AUTHOR],
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Kiss Béla');
        expect(res.body.data.roles).toEqual([PersonRole.AUTHOR]);
    });

    it('POST / creates actor', async () => {
        const res = await createRoutePerson();

        const person = await prisma.person.findUniqueOrThrow({
            where: { id: res.body.data.id },
        });

        const actor = await prisma.actor.findUnique({
            where: { id: person.actorId },
        });

        expect(actor).not.toBeNull();
        expect(actor?.type).toBe(ActorType.PERSON);
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createRoutePerson({
            name: "",
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns person', async () => {
        const created = await createRoutePerson();

        const id = created.body.data.id;

        const res = await getPerson(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates person', async () => {
        const created = await createRoutePerson();

        const id = created.body.data.id;

        const res = await updatePerson(id, {
            name: 'József Attila',
            birthYear: 1905,
            deathYear: 1937,
            roles: [PersonRole.AUTHOR, PersonRole.TRANSLATOR],
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('József Attila');
        expect(res.body.data.birthYear).toBe(1905);
        expect(res.body.data.deathYear).toBe(1937);
        expect(res.body.data.roles).toEqual([
            PersonRole.AUTHOR,
            PersonRole.TRANSLATOR,
        ]);
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createRoutePerson();

        const res = await updatePerson(created.body.data.id, {
            name: "",
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes person', async () => {
        const created = await createRoutePerson();
        const id = created.body.data.id;

        const res = await deletePerson(id);

        expect(res.status).toBe(204);

        const deleted = await getPerson(id);

        expect(deleted.status).toBe(404);
    });

    it('DELETE /:id deletes actor', async () => {
        const created = await createRoutePerson();
        const id = created.body.data.id;

        const person = await prisma.person.findUniqueOrThrow({
            where: { id },
        });

        await deletePerson(id);

        const actor = await prisma.actor.findUnique({
            where: { id: person.actorId },
        });

        expect(actor).toBeNull();
    });

});