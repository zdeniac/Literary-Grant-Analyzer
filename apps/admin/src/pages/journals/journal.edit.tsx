import { Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../components/inputs/YearInput";
import { journalStatuses } from "./journal.constants";

export const JournalEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput 
                source="name"
                validate={[required()]}
            />

            <TextInput source="issn" />

            <SelectInput
                source="status"
                validate={[required()]}
                choices={journalStatuses}
            />

            <YearInput source="foundingYear" />

            <ReferenceInput source="organizationId" reference="organizations"/>

        </SimpleForm>
    </Edit>
);