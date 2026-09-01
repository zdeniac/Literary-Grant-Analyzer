import { AutocompleteInput, ReferenceInput, type AutocompleteInputProps, } from "react-admin";

type AutocompleteReferenceInputProps = AutocompleteInputProps & {
    source: string;
    reference: string;
};

export const AutocompleteReferenceInput = ({
    source,
    reference,
    ...props
}: AutocompleteReferenceInputProps) => (
    <ReferenceInput
        source={source}
        reference={reference}
        filter={{
            perPage: 50,
            sort: "name",
            order: "ASC",
        }}
    >
        <AutocompleteInput {...props} />
    </ReferenceInput>
);