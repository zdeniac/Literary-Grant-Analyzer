import { Alert, AlertTitle, Typography } from "@mui/material";
import type { ImportRowError } from "../errors/ImportValidationApiError";

export const ImportErrorList = ({
    errors,
}: {
    errors: ImportRowError[];
}) => (
    <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
        <AlertTitle>Importálási hibák</AlertTitle>

        {errors.map((rowError) => (
            <div key={rowError.row}>
                <Typography fontWeight="bold">
                    {rowError.row}. sor
                </Typography>

                <ul style={{ marginTop: 4, marginBottom: 12 }}>
                    {rowError.issues.map((issue, index) => (
                        <li key={index}>
                            <Typography component="span">
                                { issue.message } (path: {issue.path.join(', ') })
                            </Typography>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </Alert>
);