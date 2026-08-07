import { BooleanInput, FormDataConsumer, ReferenceInput, SelectInput, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";

export const JournalAffiliationInputs = () => (
    <>
        <FormDataConsumer>
            {({ scopedFormData }) => {

                const isExisting = scopedFormData?.id !== undefined;

                return (
                    <ReferenceInput
                        source="organizationId"
                        reference="organizations"
                    >
                        <SelectInput
                            optionText="name"
                            disabled={isExisting}
                        />
                    </ReferenceInput>
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