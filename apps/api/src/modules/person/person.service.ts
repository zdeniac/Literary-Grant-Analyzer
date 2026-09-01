import { ActorType } from "@prisma/client";
import { transaction } from "../../db/transaction";
import { Id, ListQueryParams } from "../../common/types/types";
import { repositoryContainer } from "../../db/repositories/container";
import { CreatePersonInput, UpdatePersonInput } from "./dto/person.input";
import { PersonEntity } from "./dto/person.dto";
import { PersonRepository } from "./person.repository";

export class PersonService
{
    constructor(
        private readonly repository: PersonRepository,
    ) {}

    async create(dto: CreatePersonInput): Promise<PersonEntity>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const actor = await repositories.actor.create(
                ActorType.PERSON
            );

            return repositories.person.create({
                ...dto,
                actorId: actor.id,
            });
        });
    }

    async findById(id: Id): Promise<PersonEntity>
    {
        return this.repository.findByIdOrThrow(id);
    }

    async update(id: Id, data: UpdatePersonInput): Promise<PersonEntity>
    {
        return this.repository.update(id, data);
    }

    async delete(id: Id): Promise<PersonEntity>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const person = await repositories.person.delete(id);

            await repositories.actor.delete(person.actorId);

            return person;
        });
    }

    async deleteMany(ids: Id[]): Promise<number>
    {
        await transaction(async tx => {
            const repositories = repositoryContainer(tx);

            for (const id of ids) {
                const person = await repositories.person.delete(id);
                
                await repositories.actor.delete(person.actorId);
            }
        })

        return ids.length;
    }

    async getList(query?: ListQueryParams): Promise<PersonEntity[]>
    {
        return this.repository.findAll(query);
    }
}