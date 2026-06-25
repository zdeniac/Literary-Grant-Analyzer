import { useEffect, useState } from "react";

export const DataImportModal = ({ model, open }: { model: string, open: boolean }) => {
    const [schema, setSchema] = useState(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        fetch(`/api/import/schema?model=${model}`)
            .then(res => res.json())
            .then(setSchema);

        // render töltőjel
    }, [open]);

    if (!open) {
        return null;
    }

    return (
        <>
        </>
    );
};