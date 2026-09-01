import { 
    ArrayInput, 
    BooleanInput, 
    DateInput, 
    FileInput, 
    FormDataConsumer, 
    required, 
    SaveButton, 
    SelectInput, 
    SimpleForm, 
    SimpleFormIterator, 
    TextInput, 
    Toolbar, 
    useNotify, 
    useRefresh,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import type { ImportFormProps, ImportFormValues } from "../types/import-form.types";
import { url } from "../../../shared/validation/validators";
import { Box } from "@mui/material";
import { ImportValidationApiError } from "../errors/ImportValidationApiError";
import { ImportSourceDocumentApiError } from "../errors/ImportSourceDocumentApiError";
import { useEffect, useState } from "react";
import { ImportErrorList } from "./ImportErrorList";
import type { ImportRowError } from "../types/error.types";
import { validFileDelimiters } from "../constants";
import type { FileDelimiter } from "../../../../../packages/shared/enums";
import { OrganizationAutocompleteInput } from "../../../pages/organizations/components/OrganizationInput";

const titleValidation = [required()];
const urlValidation = [url(), required()];
const retrievedAtValidation = [required()];
const fileInputValidation = [required()];
const delimiterValidation = [required()];

export const ImportForm = ({ 
    submitRoute,
    acceptedFormats,
    defaultFileDelimiter,
    onDelimiterChange,
    ...props 
}: ImportFormProps) => {
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
            formData.append('delimiter', params.delimiter);

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
                        `sourceDocuments[${index}][issuingOrganizationId]`,
                        document.issuingOrganizationId
                    );
                    formData.append(
                        `sourceDocuments[${index}][retrievedAt]`,
                        document.retrievedAt
                    );
                });
            } else {
                formData.append(
                    'sourceDocuments', 
                    JSON.stringify([])
                );
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

                <SelectInput
                    source="delimiter"
                    choices={validFileDelimiters}
                    defaultValue={defaultFileDelimiter}
                    validate={delimiterValidation}
                    onChange={event => onDelimiterChange(event.target.value as FileDelimiter)}
                />

                <FileInput
                    source="file" 
                    name="file"
                    validate={fileInputValidation}
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
                                issuingOrganizationId: null,
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


                            <OrganizationAutocompleteInput source="issuingOrganizationId" />

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