import { Blueprint, CompositeRelationBlueprint, RelationalEntityBlueprint, RelationBlueprint, SimpleRelationBlueprint } from "./import.types";

export function isRelationalEntityBlueprint(blueprint: Blueprint): blueprint is RelationalEntityBlueprint
{
    return 'relations' in blueprint;
}

export function isCompositeRelationBlueprint(relation: RelationBlueprint): relation is CompositeRelationBlueprint
{
    return Array.isArray(relation.lookup);
}

export function isSimpleRelationBlueprint(relation: RelationBlueprint): relation is SimpleRelationBlueprint
{
    return !Array.isArray(relation.lookup);
}