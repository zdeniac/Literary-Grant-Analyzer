import { Button, FileInput, Form, required, useNotify, useRefresh, type ButtonProps } from "react-admin";
import SaveIcon from '@mui/icons-material/Save';
import type { AcceptedFormat, ImportFormValues } from "../types/import-field.types";

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

            const res = await fetch(submitRoute, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error('Importálási hiba');
            }

            refresh();
            notify('Sikeres importálás', {
                type: 'success'
            });
        } catch (e: unknown) {
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
            <Button variant="contained" type="submit" {...props}>
                <SaveIcon />
                Importálás
            </Button>
        </Form>
    );
};