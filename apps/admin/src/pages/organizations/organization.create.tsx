import { Create, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { legalFormChoices } from "./organization.edit";
import { YearInput } from "../../components/inputs/YearInputs";

export const OrganizationCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="address" />

            <SelectInput 
                source="legalForm"
                choices={legalFormChoices}
                validate={[required()]}
            />

            <YearInput source="foundingYear" />

        </SimpleForm>
    </Create>
);