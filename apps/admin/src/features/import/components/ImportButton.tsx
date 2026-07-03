import { Button } from "react-admin";
import { ImportModal } from "./ImportModal";
import UploadIcon from '@mui/icons-material/Upload';
import { useState } from "react";
import type { ImportButtonProps } from "../types/import-button.types";

export const ImportButton = ({ 
    model, 
    ...props 
}: ImportButtonProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="text"
                onClick={() => setOpen(true)}
                {...props}
            >
                <UploadIcon />
                Import
            </Button>
            <ImportModal model={model} open={open} onClose={() => setOpen(false)} />
        </>
    );
};