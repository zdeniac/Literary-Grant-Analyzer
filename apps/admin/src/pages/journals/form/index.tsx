import { ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { journalStatuses } from "../constants";

const validateName = [required()];
const validateStatus = [required()];

export const JournalForm = () => {
    return (
        <>
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
    
                <YearInput source="foundingYear" />
    
                <ReferenceInput source="organizationId" reference="organizations" />
    
            </SimpleForm>
        </>
    );
}