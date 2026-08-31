import { DateField, Labeled, Link, NumberField, Show, SimpleShowLayout, TextField, useRecordContext } from "react-admin";
import { Box, Chip, List, ListItem, Typography } from "@mui/material";
import { ImportJobStatusField } from "./components/ImportJobStatusField";
import { ImportJobSourceDocumentsList } from "./components/ImportJobSourceDocumentsList";

export const ImportJobShow = () => {
    const record = useRecordContext();
    console.log(record);
    return (
        <Show>
            <SimpleShowLayout>

                <Typography variant="h6">
                    Import
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                        },
                        gap: 2,
                    }}
                >
                    <Labeled label="Model">
                        <TextField source="model" />
                    </Labeled>

                    <Labeled label="Fájl">
                        <TextField source="fileName" />
                    </Labeled>

                    <Labeled label="MIME típus">
                        <TextField source="mimeType" />
                    </Labeled>

                    <Labeled label="Státusz">
                        <ImportJobStatusField />
                    </Labeled>
                </Box>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Eredmény
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 2,
                    }}
                >
                    <Box sx={{ 
                            p: 2, 
                            border: 1, 
                            borderColor: "divider", 
                            borderRadius: 1,
                            backgroundColor: "action.hover",
                        }}>
                        <Typography variant="body2" color="text.secondary">
                            Összes sor
                        </Typography>
                        <NumberField source="totalRows" />
                    </Box>

                    <Box sx={{ 
                        p: 2, 
                        border: 1, 
                        borderColor: "divider", 
                        borderRadius: 1,
                        backgroundColor: "action.hover",
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Importálva
                        </Typography>
                        <NumberField source="importedRows" />
                    </Box>

                    <Box sx={{ 
                        p: 2, 
                        border: 1, 
                        borderColor: "divider", 
                        borderRadius: 1,
                        backgroundColor: "action.hover",
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Hibás
                        </Typography>
                        <NumberField source="failedRows" />
                    </Box>
                </Box>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Importált fájlok
                </Typography>

                <Box>
                    <ImportJobSourceDocumentsList />                
                </Box>


                <Typography variant="h6" sx={{ mt: 2 }}>
                    Hiba
                </Typography>

                <Labeled label="Hibaüzenet">
                    <TextField source="errorMessage" />
                </Labeled>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Időzítés
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                    }}
                >
                    <Labeled label="Indítás">
                        <DateField source="startedAt" showTime />
                    </Labeled>

                    <Labeled label="Befejezés">
                        <DateField source="finishedAt" showTime />
                    </Labeled>
                </Box>

            </SimpleShowLayout>    

        </Show>
    );
};