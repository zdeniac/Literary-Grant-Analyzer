import { NumberField, type NumberFieldProps } from "react-admin";

export const HungarianNumberField = (props: NumberFieldProps) => (
    <NumberField 
        locales="hu-HU"
        { ...props }
    />
);