import { required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { legalForms, } from "../constants";
import { url } from "../../../shared/validation/validators";

const validateName = [required()];
const validateWebsite = [url()];
const validateLegalForm = [required()];

export const OrganizationForm = () => (
    <SimpleForm>

        <TextInput source="name" validate={validateName} />
        <TextInput source="address" />

        <TextInput source="website" validate={validateWebsite} />

        <SelectInput 
            source="legalForm"
            choices={legalForms}
            validate={validateLegalForm}
        />

        <YearInput source="foundingYear" />
        
    </SimpleForm>
);
