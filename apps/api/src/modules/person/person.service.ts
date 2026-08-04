import { ActorType } from "@prisma/client";
import { ActorRepository } from "../actor/actor.repository";
import { transaction } from "../../db/transaction";
import { Id } from "../../common/types/types";
import { createRepositories } from "../../db/repositories/factory";
import { CreatePersonInput } from "./dto/person.input";
import { PersonDto } from "./dto/person.dto";

export class PersonService
{
    async create(dto: CreatePersonInput): Promise<PersonDto>
    {
        return transaction(async tx => {
            const repositories = createRepositories(tx);

            const actor = await repositories.actor.create(
                ActorType.PERSON
            );

            return repositories.person.create({
                ...dto,
                actorId: actor.id,
            });
        });
    }

    async delete(id: Id): Promise<PersonDto>
    {
        return transaction(async tx => {
            const repositories = createRepositories(tx);

            const person = await repositories.person.delete(id);

            await repositories.actor.delete(person.actorId);

            return person;
        });
    }
}