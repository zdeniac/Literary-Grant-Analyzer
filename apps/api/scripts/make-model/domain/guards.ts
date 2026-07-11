import { ManyToOneRelationInput, OneToManyRelationInput, RelationInput } from "./types";

export function isManyToOneRelationInput(input: RelationInput): input is ManyToOneRelationInput
{
    return 'reference' in input;
}

export function isOneToManyRelationInput(input: RelationInput): input is OneToManyRelationInput
{
    return !('reference' in input);
}
