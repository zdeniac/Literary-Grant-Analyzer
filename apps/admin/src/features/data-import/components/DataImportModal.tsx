import CloseIcon from "@mui/icons-material/Close";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Table, 
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Chip,
    DialogActions,
    Box,
    IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "react-admin";

export const DataImportModal = ({ 
    model, 
    open,
    onClose,
}: { 
    model: string, 
    open: boolean,
    onClose: () => void,
}) => {
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

    const fields = schema?.data?.fields ?? [];

    return (
        <Dialog open={open} maxWidth="lg" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Import: {model}

                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 2,
                        maxHeight: 500
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Mező
                                </TableCell>

                                <TableCell>
                                    Típus
                                </TableCell>

                                <TableCell>
                                    Kötelező
                                </TableCell>

                                <TableCell>
                                    Elfogadott értékek
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {fields.map((field) => (

                                <TableRow key={field.name}>
                                    <TableCell>
                                        {field.name}
                                    </TableCell>
                                    <TableCell>
                                        {field.type}
                                    </TableCell>
                                    <TableCell>
                                        {field.required
                                            ? "Igen"
                                            : "Nem"
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {field.options?.length ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    flexWrap: "wrap"
                                                }}
                                            >
                                                {field.options.map(
                                                    (option: string) => (
                                                        <Chip
                                                            key={option}
                                                            label={option}
                                                            size="small"
                                                        />
                                                    )
                                                )}
                                            </Box>

                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>

            <DialogActions>
                <Button variant="contained">
                    Importálás
                </Button>
            </DialogActions>
        </Dialog>
    );
};