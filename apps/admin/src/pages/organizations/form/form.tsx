import { required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { legalForms, } from "../constants";
import { url } from "../../../shared/validation/validators";

export const OrganizationForm = () => {
    return (
        <SimpleForm>

            <TextInput source="name" validate={[required()]} />
            <TextInput source="address" />

            <TextInput source="website" validate={[url()]} />

            <SelectInput 
                source="legalForm"
                choices={legalForms}
                validate={[required()]}
            />

            <YearInput source="foundingYear" />
            
        </SimpleForm>
    );
}