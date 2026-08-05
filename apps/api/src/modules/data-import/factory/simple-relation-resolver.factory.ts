import { ImportLookupRegistry } from "../registry/import-lookup.registry";
import { SimpleRelationResolver } from "../resolver/simple-relation-resolver";

export const createSimpleRelationResolver = (lookups: ImportLookupRegistry) => (
    new SimpleRelationResolver(lookups)
);