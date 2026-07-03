import { required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { legalForms } from "../constants";

export const OrganizationForm = () => {
    return (
        <SimpleForm>

            <TextInput source="name" validate={[required()]} />
            <TextInput source="address" />

            <SelectInput 
                source="legalForm"
                choices={legalForms}
                validate={[required()]}
            />

            <YearInput source="foundingYear" />
            
        </SimpleForm>
    );
}