import { DateField, type DateFieldProps } from "react-admin";

export const HungarianDateField = (props: DateFieldProps) => {
    return (
        <DateField
            locales={'hu-HU'}
            {...props}
        />
    );
}
