import { 
    ArrayInput, 
    BooleanInput, 
    DateInput, 
    FileInput, 
    FormDataConsumer, 
    required, 
    SaveButton, 
    SimpleForm, 
    SimpleFormIterator, 
    TextInput, 
    Toolbar, 
    useNotify, 
    useRefresh, 
    type ButtonProps 
} from "react-admin";
import type { AcceptedFormat, ImportFormValues } from "../types/import-field.types";
import { url } from "../../../shared/validation/validators";
import { Box } from "@mui/material";

const titleValidation = [required()];
const urlValidation = [url(), required()];
const retrievedAtValidation = [required()];

export const ImportForm = ({ 
    submitRoute,
    acceptedFormats,
    ...props 
}: { 
    submitRoute: string,
    acceptedFormats: AcceptedFormat[],
} & ButtonProps) => {
    const refresh = useRefresh();
    const notify = useNotify();

    const fileImport = async (params: ImportFormValues) => {
        if (!params.file?.rawFile) {
            return;
        }
        try {
            const formData = new FormData();

            formData.append('file', params.file?.rawFile);
            formData.append('saveSourceDocument', params.saveSourceDocument ? 'true' : 'false');

            if (params.saveSourceDocument && params.sourceDocuments) {
                params.sourceDocuments.forEach((document, index) => {
                    formData.append(
                        `sourceDocuments[${index}][title]`,
                        document.title
                    );
                    formData.append(
                        `sourceDocuments[${index}][url]`,
                        document.url
                    );
                    formData.append(
                        `sourceDocuments[${index}][retrievedAt]`,
                        document.retrievedAt
                    );
                });
            }

            const res = await fetch(submitRoute, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error);
            }

            refresh();
            notify('Sikeres importálás', {
                type: 'success'
            });
        } catch (e: any) {
            notify(e.message, {
                type: 'error'
            });        
        }
    };

    return (
        <SimpleForm 
            onSubmit={fileImport}
            toolbar={
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <SaveButton label="Import" />
                </Toolbar>
            }
        >

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >

                <FileInput 
                    source="file" 
                    name="file"
                    validate={required()}
                    multiple={false} 
                    accept={{'text/csv' : ['.csv']}}
                />
            
                <BooleanInput label="Dokumentumok adatainak mentése" 
                                source="saveSourceDocument"
                />

                <FormDataConsumer>

                {({ formData }) => formData.saveSourceDocument ? (
                    
                    <ArrayInput
                        source="sourceDocuments"
                        defaultValue={[
                            {
                                title: '',
                                url: '',
                                retrievedAt: undefined,
                            },
                        ]}
                    >

                        <SimpleFormIterator disableReordering>                                
                            <TextInput
                                source="title"
                                validate={titleValidation}
                            />

                            <TextInput
                                source="url"
                                validate={urlValidation}
                            />

                            <DateInput
                                source="retrievedAt"
                                validate={retrievedAtValidation}
                            />

                        </SimpleFormIterator>

                    </ArrayInput>

                ) : null }

                </FormDataConsumer>

            </Box>
            
        </SimpleForm>
    );
};