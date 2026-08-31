import { Chip } from "@mui/material";
import { useRecordContext } from "react-admin";

export const ImportJobStatusField = () => {
    const record = useRecordContext();

    if (!record?.status) {
        return null;
    }

    const colorMap = {
        RUNNING: "warning",
        COMPLETED: "success",
        FAILED: "error",
    } as const;

    return (
        <Chip
            variant="outlined"
            label={record.status}
            color={colorMap[record.status]}
            sx={{
                width: "fit-content",
            }}
        />
    );
};
