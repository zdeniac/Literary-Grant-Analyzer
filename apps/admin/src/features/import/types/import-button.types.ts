import type { ButtonProps } from "react-admin";
import type { FileDelimiter } from "../../../../../packages/shared/enums";

export type EntityName = 
    | 'organization' 
    | 'journal'
    | 'decisionAuthority'
    | 'awardScheme'
    | 'person'
    | 'awardDecision'
;

export type ImportButtonProps = ButtonProps & {
    fileHeader: string[],
    fileDelimiter: FileDelimiter,
    entity: EntityName,
};
