import { BooleanInput, FormDataConsumer, ReferenceInput, SelectInput, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { OrganizationAutocompleteInput } from "../../organizations/components/OrganizationInput";

export const JournalAffiliationInputs = () => (
    <>
        <FormDataConsumer>
            {({ scopedFormData }) => {

                const isExisting = scopedFormData?.id !== undefined;

                return (
                    <OrganizationAutocompleteInput 
                        source="organizationId"
                        disabled={isExisting}
                    />
                );
            }}
        </FormDataConsumer>

        <YearInput source="fromYear" />
        <YearInput source="toYear" />

        <BooleanInput source="isCurrent" />

        <ReferenceInput
            source="sourceDocumentId"
            reference="source-documents"
        >
            <SelectInput optionText="title" />
        </ReferenceInput>

        <TextInput source="note" />
    </>
);