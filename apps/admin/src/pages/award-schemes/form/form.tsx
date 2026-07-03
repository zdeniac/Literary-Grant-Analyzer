import { ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { awardSchemeTypes } from "../constants";

export const AwardSchemeForm = () => (
    <>
        <SimpleForm>
            <TextInput 
                source="name"
                validate={[required()]} 
            />

            <SelectInput
                source="type"
                choices={awardSchemeTypes}
                validate={[required()]}
            />

            <ReferenceInput source="organizationId" reference="organizations"/>

        </SimpleForm>
    </>
);