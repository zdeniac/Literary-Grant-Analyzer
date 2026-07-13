import { DateTimeInput, required, SimpleForm, TextInput } from "react-admin";
import { url } from "../../../shared/validation/validators";

export const SourceDocumentForm = () => {
    return (
        <>
            <SimpleForm>
                <TextInput 
                    source="title"
                    validate={[required()]}
                />

                <TextInput source="url" validate={[url(), required()]}/>

                <DateTimeInput source="retrievedAt" validate={[required()]} />
            
            </SimpleForm>
        </>
    );
}