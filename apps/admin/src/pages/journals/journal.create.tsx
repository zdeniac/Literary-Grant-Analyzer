import { Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../components/inputs/YearInput";
import { journalStatuses } from "./journal.constants";

export const JournalCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput 
                source="name"
                validate={[required()]} 
            />

            <TextInput source="issn" />

            <SelectInput
                source="status"
                choices={journalStatuses}
                validate={[required()]}
            />

            <YearInput source="foundingYear" />

            <ReferenceInput source="organizationId" reference="organizations"/>

        </SimpleForm>
    </Create>
);