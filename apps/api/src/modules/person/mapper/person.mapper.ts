import { DtoMapper } from "../../../common/types/types";
import { PersonDto, PersonEntity } from "../dto/person.dto";

export const toPersonDto: DtoMapper<PersonEntity, PersonDto> = (person) => ({
    id: person.id,

    firstName: person.firstName,
    lastName: person.lastName,

    deathYear: person.deathYear,
    birthYear: person.birthYear,

    roles: person.roles,

    actorId: person.actorId,

    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
});