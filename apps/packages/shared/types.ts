import { resourceToSortableEntity, validSortableFields } from "./constants";

export type ResourceName = keyof typeof resourceToSortableEntity;
export type SortableEntityName = keyof typeof validSortableFields;