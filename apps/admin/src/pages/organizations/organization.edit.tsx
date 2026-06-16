import { Edit, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../components/inputs/YearInput";
import { legalForms } from "./organization.constants";

export const OrganizationEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput 
                source="name"
                validate={[required()]}
            />

            <TextInput source="address" />

            <SelectInput 
                source="legalForm"
                validate={[required()]}
                choices={legalForms}
            />

            <YearInput source="foundingYear" />
        </SimpleForm>
    </Edit>
);