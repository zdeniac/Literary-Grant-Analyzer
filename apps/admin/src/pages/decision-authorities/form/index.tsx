import { required, SimpleForm, TextInput } from "react-admin";
import { OrganizationAutocompleteInput } from "../../organizations/components/OrganizationInput";

const validateName = [required()];
const validateOrganizationId = [required()];

export const DecisionAuthorityForm = () => {
    return (
        <SimpleForm>
            <TextInput 
                source="name"
                validate={validateName}
            />

            <OrganizationAutocompleteInput source="organizationId" validate={validateOrganizationId} />

        </SimpleForm>
    );
}