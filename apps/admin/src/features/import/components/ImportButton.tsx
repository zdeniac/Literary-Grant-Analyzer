import { Button } from "react-admin";
import { ImportModal } from "./ImportModal";
import UploadIcon from '@mui/icons-material/Upload';
import { useState } from "react";

export const ImportButton = ({
    model
}: { model: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="text"
                onClick={() => setOpen(true)}
            >
                <UploadIcon />
                Import
            </Button>
            <ImportModal model={model} open={open} onClose={() => setOpen(false)} />
        </>
    );
};