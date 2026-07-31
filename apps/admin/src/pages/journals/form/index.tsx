import { ArrayInput, ReferenceInput, required, SelectArrayInput, SelectInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { journalFormats, journalStatuses } from "../constants";

const validateName = [required()];
const validateStatus = [required()];
const validateFormat = [required()];

export const JournalForm = () => (
    <SimpleForm>
        <TextInput 
            source="name"
            validate={validateName}
        />

        <TextInput source="issn" />

        <SelectInput
            source="status"
            validate={validateStatus}
            choices={journalStatuses}
        />

        <SelectArrayInput
            source="format"
            validate={validateFormat}
            choices={journalFormats}
        />

        <YearInput source="foundingYear" />

        <ArrayInput source="affiliations">
            <SimpleFormIterator>
                <ReferenceInput
                    source="organizationId"
                    reference="organizations"
                >
                    <SelectInput optionText="name" />
                </ReferenceInput>

                <YearInput source="fromYear" />

                <YearInput source="toYear" />

                <TextInput source="note" />
            </SimpleFormIterator>
        </ArrayInput>

    </SimpleForm>
);