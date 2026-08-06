import { CompositeRelationImportBlueprint, RelationImportBlueprint, SimpleRelationImportBlueprint } from "./import-blueprint.types";
import { ImportRow } from "./import.types";

export type RelationResolverRegistry = {
    simple: RelationResolverInterface<SimpleRelationImportBlueprint>;
    composite: RelationResolverInterface<CompositeRelationImportBlueprint>;
};

export interface RelationResolverInterface<T extends RelationImportBlueprint>
{
    resolve(rows: ImportRow[], relationBlueprint: T): Promise<ImportRow[]>;
}

export interface ImportWriterInterface<TCreate>
{
    createMany(data: TCreate[]): Promise<number>;
}
