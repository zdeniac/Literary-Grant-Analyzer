import { Blueprint, CompositeRelationBlueprint, RelationalModelBlueprint, RelationBlueprint, SimpleRelationBlueprint } from "./import.types";

export function isRelationalModelBlueprint(blueprint: Blueprint): blueprint is RelationalModelBlueprint
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