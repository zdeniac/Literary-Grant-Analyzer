import { RelationResolver } from "../resolver/relation-resolver";
import { createImportLookups } from "./lookups.factory";

export const createRelationResolver = (lookups: ReturnType<typeof createImportLookups>) => (
    new RelationResolver(lookups)
);