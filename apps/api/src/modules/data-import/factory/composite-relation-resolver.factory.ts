import { CompositeRelationResolver } from "../resolver/composite-relation-resolver";
import { createImportLookups } from "./lookups.factory";

export const createCompositeRelationResolver = (lookups: ReturnType<typeof createImportLookups>) => (
    new CompositeRelationResolver(lookups)
);