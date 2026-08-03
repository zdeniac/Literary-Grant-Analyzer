import { ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

const validateName = [required()];

export const DecisionAuthorityForm = () => {
    return (
        <>
            <SimpleForm>
                <TextInput 
                    source="name"
                    validate={validateName}
                />

                <ReferenceInput 
                    source="organizationId" 
                    reference="organizations"
                />

            </SimpleForm>
        </>
    );
}