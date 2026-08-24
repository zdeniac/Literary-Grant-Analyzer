import { required, SelectInput, SimpleForm, TextArrayInput, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { legalForms, sectors, } from "../constants";
import { url } from "../../../shared/validation/validators";

const validateName = [required()];
const validateWebsite = [url()];
const validateLegalForm = [required()];
const validateSector = [required()];

export const OrganizationForm = () => (
    <SimpleForm>

        <TextInput source="name" validate={validateName} />
        <TextArrayInput source="nameVariants" />

        <TextInput source="address" />

        <TextInput source="website" validate={validateWebsite} />

        <SelectInput 
            source="legalForm"
            choices={legalForms}
            validate={validateLegalForm}
        />

        <SelectInput 
            source="sector"
            choices={sectors}
            validate={validateSector}
        />

        <YearInput source="foundingYear" />
        
    </SimpleForm>
);
