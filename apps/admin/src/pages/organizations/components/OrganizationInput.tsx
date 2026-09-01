import { type AutocompleteInputProps } from "react-admin";
import { AutocompleteReferenceInput } from "../../../components/inputs/AutocompleteReferenceInput";

type OrganizationAutocompleteInputProps = AutocompleteInputProps & {
    source: string;
    reference?: string;
};

export const OrganizationAutocompleteInput = ({
    source,
    reference = 'organizations',
    ...props
}: OrganizationAutocompleteInputProps) => (
    <AutocompleteReferenceInput
        source={source}
        reference={reference}
        optionText="name"
        filterToQuery={(searchText) => ({
            q: searchText,
            fields: ["name", "nameVariants"],
        })}
        {...props}
    />
);
