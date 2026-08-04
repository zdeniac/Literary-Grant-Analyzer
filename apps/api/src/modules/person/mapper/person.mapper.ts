import { DtoMapper } from "../../../common/types/types";
import { PersonDto, PersonModel } from "../dto/person.dto";

export const toPersonDto: DtoMapper<PersonModel, PersonDto> = (person) => ({
    id: person.id,

    name: person.name,
    deathYear: person.deathYear,
    birthYear: person.birthYear,

    roles: person.roles,

    actorId: person.actorId,

    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
});