import { BooleanInput, Button, DateInput, FileInput, Form, FormDataConsumer, required, TextInput, useNotify, useRefresh, type ButtonProps } from "react-admin";
import SaveIcon from '@mui/icons-material/Save';
import type { AcceptedFormat, ImportFormValues } from "../types/import-field.types";
import { url } from "../../../shared/validation/validators";
import { Box, Fade } from "@mui/material";

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

            if (params.saveSourceDocument) {
                formData.append('title', params.title);
                formData.append('url', params.url);
                formData.append('retrievedAt', params.retrievedAt);
            }
                        
            const res = await fetch(submitRoute, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const body = await res.json();
                console.log(body);
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
        <Form onSubmit={fileImport}>
            <FileInput 
                source="file" 
                name="file"
                validate={required()}
                multiple={false} 
                accept={{'text/csv' : ['.csv']}}
            />
        
            <BooleanInput label="Dokumentum adatainak mentése" 
                            source="saveSourceDocument"
            />

            <FormDataConsumer>
                {({ formData }) =>
                    formData.saveSourceDocument ? (
                        <Fade in={formData.saveSourceDocument}>
                            <Box>
                                <TextInput source="title" validate={urlValidation} />
                                <TextInput source="url" validate={titleValidation} />
                                <DateInput source="retrievedAt" validate={retrievedAtValidation} />
                            </Box>
                        </Fade>                
                    ) : null
                }
            </FormDataConsumer>

            <Button variant="contained" type="submit" {...props}>
                <SaveIcon />
                Importálás
            </Button>
        </Form>
    );
};