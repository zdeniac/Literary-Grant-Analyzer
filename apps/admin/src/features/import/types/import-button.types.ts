import type { ButtonProps } from "react-admin";

export type ModelName = 
    | 'organization' 
    | 'journal'
    | 'decisionBody'
    | 'awardScheme';

export type ImportButtonProps = ButtonProps & {
    model: ModelName;
};
