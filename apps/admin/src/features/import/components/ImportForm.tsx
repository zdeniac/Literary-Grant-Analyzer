import { Button, FileInput, Form, required, type ButtonProps } from "react-admin";
import SaveIcon from '@mui/icons-material/Save';

type ImportFormValues = {
    file?: {
        rawFile: File;
    };
};

export const ImportForm = ({ 
    submitRoute, 
    ...props 
}: { 
    submitRoute: string 
} & ButtonProps) => {
    const fileImport = async (params: ImportFormValues) => {
        if (!params.file?.rawFile) {
            return;
        }
        
        const formData = new FormData();
        
        formData.append('file', params.file?.rawFile);

        const res = await fetch(submitRoute, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            throw new Error('Import failed');
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