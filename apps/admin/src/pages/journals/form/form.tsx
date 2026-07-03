import { ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { journalStatuses } from "../constants";

export const JournalForm = () => {
    return (
        <>
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
    
                <ReferenceInput source="organizationId" reference="organizations" />
    
            </SimpleForm>
        </>
    );
}