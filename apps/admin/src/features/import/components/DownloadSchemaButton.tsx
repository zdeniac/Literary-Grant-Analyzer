import { Button, type ButtonProps } from "react-admin";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const DownloadSchemaButton = ({
    fileHeader,
    model,
    ...props
}: { 
    fileHeader: string[],
    model: string,
} & ButtonProps) => {
    // @todo: add 2nd row if options are set
    // @todo: add select for valid types
    const createFile = (header: string[]) => {
        const file = new File(
            [header.join(",") + "\n"],
            `${model}_importschema.csv`,
            {
                type: "text/csv;charset=utf-8"
            }
        );

        const url = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${model}_importschema.csv`;

        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <Button variant="contained" onClick={() => createFile(fileHeader)} {...props}>
            <FileDownloadIcon />
            Importálási séma letöltése
        </Button>
    );
};