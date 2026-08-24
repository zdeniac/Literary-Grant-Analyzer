import { Button } from "react-admin";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { ImportButtonProps } from "../types/import-button.types";
import type { FileDelimiter } from "../../../../../packages/shared/enums";

export const DownloadImportSchemaButton = ({
    fileHeader,
    fileDelimiter,
    entity,
    ...props
}: ImportButtonProps) => {
    const createFile = (header: string[], delimiter: FileDelimiter) => {
        const file = new File(
            [header.join(delimiter) + "\n"],
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
        <Button variant="text" onClick={() => createFile(fileHeader, fileDelimiter)} {...props}>
            <FileDownloadIcon />
            Importálási séma letöltése
        </Button>
    );
};