import { 
    ArrayInput, 
    BooleanInput, 
    DateInput, 
    FileInput, 
    FormDataConsumer, 
    ReferenceInput, 
    required, 
    SaveButton, 
    SelectInput, 
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
import { ImportValidationApiError, type ImportRowError } from "../errors/ImportValidationApiError";
import { ImportSourceDocumentApiError } from "../errors/ImportSourceDocumentApiError";
import { useState } from "react";
import { ImportErrorList } from "./ImportErrorList";

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
    const [importErrors, setImportErrors] = useState<ImportRowError[]>([]);

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

                if (ImportValidationApiError.codes.includes(body.error)) {
                    throw new ImportValidationApiError(
                        body.errors
                    );
                } else if (body.error === ImportSourceDocumentApiError.code) {
                    throw new ImportSourceDocumentApiError();
                } else {
                    throw new Error(body.error);
                }
            }

            refresh();
            notify('Sikeres importálás', {
                type: 'success'
            });
        } catch (e: any) {
            if (e instanceof ImportValidationApiError) {
                setImportErrors(e.errors ?? []);
                return;
            }

            if (e instanceof ImportSourceDocumentApiError) {
                notify(e.message, {
                    type: 'error'
                });
                return;
            }

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

                <FormDataConsumer>
                    {({ formData }) => {
                        const file = formData.file?.rawFile;

                        if (!file) {
                            return null;
                        }

                        return (
                            <Box
                                sx={{
                                    mt: 0,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 1,
                                    backgroundColor: 'success.dark',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                ✓ Csatolva: {file.name}
                            </Box>
                        );
                    }}
                </FormDataConsumer>

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
                                organizationId: null,
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

                            <ReferenceInput
                                source="issuingOrganizationId"
                                reference="organizations"
                            >
                                <SelectInput optionText="name" />
                            </ReferenceInput>
            
                            <DateInput
                                source="retrievedAt"
                                validate={retrievedAtValidation}
                            />

                        </SimpleFormIterator>

                    </ArrayInput>

                ) : null }

                </FormDataConsumer>

            {importErrors?.length > 0 && (
                <ImportErrorList errors={importErrors!} />
            )}

            </Box>

        </SimpleForm>
    );
};