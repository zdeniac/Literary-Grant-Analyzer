import { ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";
import { awardSchemeTypes, fundingAreas } from "../constants";

const validateName = [required()];
const validateType = [required()];
const validateFundingArea = [required()];

export const AwardSchemeForm = () => (
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

        <SelectInput
            source="fundingArea"
            choices={fundingAreas}
            validate={validateFundingArea}
        />

        <ReferenceInput source="organizationId" reference="organizations"/>

    </SimpleForm>
);