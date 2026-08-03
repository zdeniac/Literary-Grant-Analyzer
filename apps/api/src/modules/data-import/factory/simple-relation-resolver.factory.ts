import { SimpleRelationResolver } from "../resolver/simple-relation-resolver";
import { createImportLookups } from "./lookups.factory";

export const createSimpleRelationResolver = (lookups: ReturnType<typeof createImportLookups>) => (
    new SimpleRelationResolver(lookups)
);