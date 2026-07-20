import { ReferenceInput, required, SelectArrayInput, SelectInput, SimpleForm, TextInput } from "react-admin";
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

        <ReferenceInput source="organizationId" reference="organizations" />

    </SimpleForm>
);