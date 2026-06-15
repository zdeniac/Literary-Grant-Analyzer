import { SelectInput, type SelectInputProps } from "react-admin";

type YearInputProps = Omit<SelectInputProps, 'choices'> & {
    source: string;
    minYear?: number;
    maxYear?: number;
};

export const YearInput = ({
    source,
    minYear = 1900,
    maxYear = new Date().getFullYear(),
    ...params
}: YearInputProps) => {
    const years = Array.from(
        { length: 100 },
        (_, i) => {
            const year = new Date().getFullYear() - i;
            return { id: year, name: year };
    });

    return (
        <SelectInput
            source={source}
            choices={years}
            { ...params}
        />
    );
};
