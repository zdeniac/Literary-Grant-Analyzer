import { ImportBlueprint, CompositeRelationImportBlueprint, RelationalEntityImportBlueprint, RelationImportBlueprint, SimpleRelationImportBlueprint } from "./import-blueprint.types";

export function isRelationalEntityBlueprint(blueprint: ImportBlueprint): blueprint is RelationalEntityImportBlueprint
{
    return 'relations' in blueprint;
}

export function isCompositeRelationBlueprint(relation: RelationImportBlueprint): relation is CompositeRelationImportBlueprint
{
    return Array.isArray(relation.lookup);
}

export function isSimpleRelationBlueprint(relation: RelationImportBlueprint): relation is SimpleRelationImportBlueprint
{
    return !Array.isArray(relation.lookup);
}