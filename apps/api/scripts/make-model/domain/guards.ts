import { RelationInput } from "./types";

export function isManyToOneRelationInput(input: RelationInput): boolean
{
    return 'reference' in input;
}

export function isOneToManyRelationInput(input: RelationInput): boolean
{
    return !('reference' in input);
}
