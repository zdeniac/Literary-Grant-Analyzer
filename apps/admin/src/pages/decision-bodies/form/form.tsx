import { ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

export const DecisionBodyForm = () => {
    return (
        <>
            <SimpleForm>
                <TextInput 
                    source="name"
                    validate={[required()]}
                />

                <ReferenceInput source="organizationId" reference="organizations"/>

            </SimpleForm>
        </>
    );
}