import { ImportLookupRegistry } from "../registry/import-lookup.registry";
import { CompositeRelationResolver } from "../resolver/composite-relation-resolver";

export const createCompositeRelationResolver = (lookups: ImportLookupRegistry) => (
    new CompositeRelationResolver(lookups)
);