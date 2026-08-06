import { ZodObject } from "zod";
import { ImportableEntityName } from "../constants/importable-models";
import { ImportField } from "./import.types";
import { EntityName } from "../../../common/types/types";

/**
 * The bluepring represents a value from the imported row to a related database record.
 *
 * Example:
 * - sourceField: 'organizationName'
 * - lookupField: 'name'
 *
 * means that the value of the imported 'organizationName' column
 * is matched against the Organization.name column.
 */

export type EntityImportBlueprint = {
    entity: ImportableEntityName;
    fields: ImportField[];
    schema: ZodObject;
};
export type RelationalEntityImportBlueprint = EntityImportBlueprint & {
    relations: RelationImportBlueprint[];
};
export type ImportBlueprint = EntityImportBlueprint | RelationalEntityImportBlueprint;

export type SimpleImportLookup = {
    // Column name in the imported file.
    sourceField: string;

    // Field of the related model used for the lookup.
    lookupField: string;
};
export type CompositeImportLookup = Array<SimpleImportLookup & {    
    // Used when the input sourceField's value is not unique 
    // (e.g., multiple records with the same name).
    foreignEntity?: EntityName;
    foreignKey?: string;
}>;

export type RelationMapping = {
    // Field written to the imported row after the relation is resolved.
    foreignKey: string;

    // Field copied from the matched related record.
    targetField: string;
};
export type SimpleRelationImportBlueprint = RelationMapping & {
    // The related model. Can be a single model or an array of models, 
    // e.g. for polymorphic relations.
    entity: EntityName | EntityName[];

    // One or more fields used to uniquely identify the related record.
    lookup: SimpleImportLookup;

    // Whether the imported column may contain multiple values
    // (e.g. 'Org A|Org B' for an N:M relation).
    multiple?: boolean;
};
export type CompositeRelationImportBlueprint = RelationMapping & {
    // The related model. Can be a single model or an array of models, 
    // e.g. for polymorphic relations.
    // model: ModelName;
    entity: EntityName;

    // One or more fields used to uniquely identify the related record.
    lookup: CompositeImportLookup;
};
export type RelationImportBlueprint = SimpleRelationImportBlueprint | CompositeRelationImportBlueprint;
