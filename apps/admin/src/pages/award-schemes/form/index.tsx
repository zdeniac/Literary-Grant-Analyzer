import { ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { awardSchemeTypes } from "../constants";

const validateName = [required()];
const validateType = [required()];

export const AwardSchemeForm = () => (
    <>
        <SimpleForm>
            <TextInput 
                source="name"
                validate={validateName} 
            />

            <SelectInput
                source="type"
                choices={awardSchemeTypes}
                validate={validateType}
            />

            <ReferenceInput source="organizationId" reference="organizations"/>

        </SimpleForm>
    </>
);