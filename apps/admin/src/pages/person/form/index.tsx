import { NumberInput, required, SelectArrayInput, SimpleForm, TextInput } from "react-admin";
import { personRoles } from "../constants";

const validateName = [required()];
const validateRoles = [required()];

export const PersonForm = () => (
    <SimpleForm>
        <TextInput 
            source="firstName"
            validate={validateName}
        />

        <TextInput 
            source="lastName"
            validate={validateName}
        />

        <NumberInput source="birthYear" />

        <NumberInput source="deathYear" />

        <SelectArrayInput
            source="roles"
            choices={personRoles}
            validate={validateRoles}
        />
    </SimpleForm>
);