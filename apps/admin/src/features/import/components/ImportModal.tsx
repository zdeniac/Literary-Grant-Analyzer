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
    LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DownloadSchemaButton } from "./DownloadSchemaButton";
import { ImportForm } from "./ImportForm";

export const ImportModal = ({ 
    model, 
    open,
    onClose,
}: { 
    model: string, 
    open: boolean,
    onClose: () => void,
}) => {
    const [schema, setSchema] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const submitRoute = `api/import/${model}`;

    useEffect(() => {
        if (!open) {
            return;
        }

        const loadSchema = async () => {
            setSchema(null);
            setIsPending(true);

            try {
                const res = await fetch(`/api/import/schema?model=${model}`);
                const data = await res.json();

                setSchema(data);
            } finally {
                setIsPending(false);
            }
        };
        
        loadSchema();    
    }, [open, model]);

    if (!open) {
        return null;
    }

    const fields = schema?.data?.fields ?? [];
    const header = fields?.map(field => field.name);

    return isPending 
    ? (
        <Dialog open={open} maxWidth="lg" fullWidth>
            <LinearProgress aria-label="Betöltés..." />
        </Dialog> 
    ): (
        <Dialog open={open} maxWidth="lg" fullWidth>
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                    className=""
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
                                            ? 'Igen'
                                            : 'Nem'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {field.options?.length ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    flexWrap: 'wrap'
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

            <DialogActions
                sx={{
                    justifyContent: "center",
                    gap: 2,
                    padding: 2,
                }}
            >
                <DownloadSchemaButton fileHeader={header} model={model} />
                <ImportForm submitRoute={submitRoute} />
            </DialogActions>
        </Dialog>
    );
};