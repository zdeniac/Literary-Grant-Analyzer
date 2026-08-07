import { ArrayInput, required, SelectArrayInput, SelectInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";
import { YearInput } from "../../../components/inputs/YearInput";
import { journalFormats, journalStatuses } from "../constants";
import { IssnInput } from "../../../components/inputs/IssnInput";
import { JournalAffiliationInputs } from "./JournalAffiliationInputs";

const validateName = [required()];
const validateStatus = [required()];
const validateFormat = [required()];

export const JournalForm = () => (
    <SimpleForm>
        <TextInput source="name" validate={validateName} />

        <IssnInput source="issn" />

        <SelectInput
            source="status"
            validate={validateStatus}
            choices={journalStatuses}
        />

        <SelectArrayInput
            source="format"
            validate={validateFormat}
            choices={journalFormats}
        />

        <YearInput source="foundingYear" />

        <ArrayInput source="affiliations">

            <SimpleFormIterator>
                <JournalAffiliationInputs />
            </SimpleFormIterator>

        </ArrayInput>

    </SimpleForm>
);