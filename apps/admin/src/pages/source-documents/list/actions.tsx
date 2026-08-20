import { CreateButton, ExportButton, Form, TopToolbar } from "react-admin";
import { Box } from "@mui/material";
import { MultiFieldSearchBox } from "../../../components/form/MultiFieldSearchBox";
import { validSortableFields } from "../../../../../packages/shared/constants";

export const SourceDocumentActions = () => (
    <Box sx={{ width: "100%" }}>
        <TopToolbar>
            <CreateButton />
            <ExportButton />
        </TopToolbar>

        <Form>
            <MultiFieldSearchBox fields={validSortableFields.sourceDocument} />
        </Form>
    </Box>
);