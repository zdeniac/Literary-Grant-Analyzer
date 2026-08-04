import type { ButtonProps } from "react-admin";

export type ModelName = 
    | 'organization' 
    | 'journal'
    | 'decisionAuthority'
    | 'awardScheme'
    | 'person'
;

export type ImportButtonProps = ButtonProps & {
    model: ModelName;
};
