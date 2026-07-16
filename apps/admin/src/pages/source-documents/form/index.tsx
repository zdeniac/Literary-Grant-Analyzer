import { DateTimeInput, required, SimpleForm, TextInput } from "react-admin";
import { url } from "../../../shared/validation/validators";

const validateTitle = [required()];
const validateUrl = [url(), required()];
const validateRetrievedAt = [required()];

export const SourceDocumentForm = () => (
    <SimpleForm>
        <TextInput 
            source="title"
            validate={validateTitle}
        />

        <TextInput source="url" validate={validateUrl}/>

        <DateTimeInput source="retrievedAt" validate={validateRetrievedAt} />
    
    </SimpleForm>
);
