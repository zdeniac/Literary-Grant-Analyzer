import { Box, ListItem, Typography } from "@mui/material";
import type { ImportRowError } from "../errors/ImportValidationApiError";
import { List } from "react-admin";

export const ImportErrorList = ({errors}: {errors: ImportRowError[]}) => (
    <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6">
            Importálási hibák
        </Typography>

        <List>
            {errors.map((rowError) => (
                <ListItem 
                    key={rowError.row}
                    sx={{ display: 'block' }}
                >
                    <Typography fontWeight="bold">
                        {rowError.row}. sor
                    </Typography>

                    <List>
                        {rowError.issues.map((issue, index) => (
                            <ListItem key={index}>
                                {issue.field && `${issue.field}: `}
                                {issue.message}
                            </ListItem>
                        ))}
                    </List>
                </ListItem>
            ))}
        </List>
    </Box>
);
