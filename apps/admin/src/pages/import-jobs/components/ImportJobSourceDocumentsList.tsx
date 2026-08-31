import { Box, List, ListItem, Typography } from "@mui/material";
import { Link, useRecordContext } from "react-admin";

export const ImportJobSourceDocumentsList= () => {
    const importJob = useRecordContext();

    return (
        <List sx={{ width: "100%" }}>
            {importJob?.sourceDocuments?.map((sourceDocument) => (
                <ListItem
                    key={sourceDocument.id}
                    disableGutters
                    sx={{
                        mb: 1.5,
                        p: 2,
                        border: 1,
                        backgroundColor: "action.hover",
                        borderColor: "divider",
                        borderRadius: 1,
                        display: "block",
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        <Link to={`/source-documents/${sourceDocument.id}`}>
                            {sourceDocument.title}
                        </Link>
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        ID: {sourceDocument.id}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <a
                            href={sourceDocument.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {sourceDocument.url}
                        </a>
                    </Typography>

                    <Box
                        sx={{
                            mt: 1.5,
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(3, 1fr)",
                            },
                            gap: 1,
                        }}
                    >
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Letöltve
                            </Typography>
                            <Typography variant="body2">
                                {sourceDocument.retrievedAt
                                    ? new Date(sourceDocument.retrievedAt).toLocaleString()
                                    : "—"}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Létrehozva
                            </Typography>
                            <Typography variant="body2">
                                {sourceDocument.createdAt
                                    ? new Date(sourceDocument.createdAt).toLocaleString()
                                    : "—"}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Módosítva
                            </Typography>
                            <Typography variant="body2">
                                {sourceDocument.updatedAt
                                    ? new Date(sourceDocument.updatedAt).toLocaleString()
                                    : "—"}
                            </Typography>
                        </Box>
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};