import { Blueprint, RelationalModelBlueprint } from "./import.types";

export function isRelationalModelBlueprint(blueprint: Blueprint): blueprint is RelationalModelBlueprint
{
    return 'relations' in blueprint;
}
