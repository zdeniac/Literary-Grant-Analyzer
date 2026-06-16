import { Create, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../components/inputs/YearInput";
import { legalForms } from "./organization.constants";

export const OrganizationCreate = () => (
    <Create>
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
    </Create>
);