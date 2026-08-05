import type { ButtonProps } from "react-admin";

export type EntityName = 
    | 'organization' 
    | 'journal'
    | 'decisionAuthority'
    | 'awardScheme'
    | 'person'
    | 'awardDecision'
;

export type ImportButtonProps = ButtonProps & {
    entity: EntityName;
};
