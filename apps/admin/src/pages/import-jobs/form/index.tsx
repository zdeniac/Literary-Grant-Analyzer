import { DateInput, NumberInput, SelectInput, TextInput } from "react-admin";
import { importJobStatuses } from "../constants";

export const ImportJobForm = () => (
    <>
        <TextInput
            source="model"
            disabled
        />

        <TextInput
            source="fileName"
            disabled
        />

        <TextInput
            source="mimeType"
            disabled
        />

        <SelectInput
            source="status"
            choices={importJobStatuses}
            disabled
        />

        <NumberInput source="totalRows" disabled />

        <NumberInput source="importedRows" disabled />

        <NumberInput
            source="failedRows"
            disabled
        />

        <TextInput
            source="errorMessage"
            multiline
            fullWidth
            disabled
        />

        <DateInput source="startedAt" disabled />
        <DateInput source="finishedAt" disabled />
    </>
);