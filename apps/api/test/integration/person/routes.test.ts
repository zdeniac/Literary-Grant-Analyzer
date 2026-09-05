import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { ActorType } from "@prisma/client";
import { PersonRole } from "../../../../packages/shared/enums";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import {
    createPerson,
    deleteManyPersons,
    deletePerson,
    getPerson,
    updatePerson,
} from "../helpers/api/person.api";
import { expectNotFound } from "../helpers/error.helper";
import { HttpStatusCode } from "../../../src/common/http/status-codes";

describe('Person routes test', () => {
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createRoutePerson = async (
        overrides: Partial<{
            firstName: string;
            lastName: string;
            birthYear: number;
            deathYear: number;
            roles: PersonRole[];
        }> = {}
    ) => createPerson({
        ...overrides,
    });

    it('POST / creates person', async () => {
        const res = await createRoutePerson({
            firstName: 'Kiss',
            lastName: 'Béla',
            roles: [PersonRole.AUTHOR],
        });

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.firstName).toBe('Kiss');
        expect(res.body.data.lastName).toBe('Béla');
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
            firstName: '',
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns person', async () => {
        const created = await createRoutePerson();

        const id = created.body.data.id;

        const res = await getPerson(id);

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates person', async () => {
        const created = await createRoutePerson();

        const id = created.body.data.id;

        const res = await updatePerson(id, {
            firstName: 'József',
            lastName: 'Attila',
            birthYear: 1905,
            deathYear: 1937,
            roles: [PersonRole.AUTHOR, PersonRole.TRANSLATOR],
        });

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.firstName).toBe('József');
        expect(res.body.data.lastName).toBe('Attila');
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
            firstName: '',
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes person', async () => {
        const created = await createRoutePerson();
        const id = created.body.data.id;

        const res = await deletePerson(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const deleted = await getPerson(id);

        expect(deleted.status).toBe(HttpStatusCode.NOT_FOUND);
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

    it('DELETE / deletes many persons', async () => {
        const created1 = await createRoutePerson({ firstName: 'Nagy', lastName: 'László' });
        const created2 = await createRoutePerson({ firstName: 'Iksz', lastName: 'Ipszilon' });
        const created3 = await createRoutePerson({ firstName: 'Farkas', lastName: 'Bálint' });

        const id1 = created1.body.data.id;
        const id2 = created2.body.data.id;
        const id3 = created3.body.data.id;

        const ids = [
            id1,
            id2,
            id3,
        ];

        const res = await deleteManyPersons(ids);

        expect(res.status).toBe(HttpStatusCode.OK);

        await expectNotFound(getPerson(ids[0]));
        await expectNotFound(getPerson(ids[1]));
        await expectNotFound(getPerson(ids[2]));
    });
});