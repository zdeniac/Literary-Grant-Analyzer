import { Button } from "react-admin";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { ImportButtonProps } from "../types/import-button.types";

export const DownloadImportSchemaButton = ({
    fileHeader,
    entity,
    ...props
}: { 
    fileHeader: string[],
} & ImportButtonProps) => {
    const createFile = (header: string[]) => {
        const file = new File(
            [header.join(",") + "\n"],
            `${entity}_importschema.csv`,
            {
                type: "text/csv;charset=utf-8"
            }
        );

        const url = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${entity}_importschema.csv`;

        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <Button variant="text" onClick={() => createFile(fileHeader)} {...props}>
            <FileDownloadIcon />
            Importálási séma letöltése
        </Button>
    );
};