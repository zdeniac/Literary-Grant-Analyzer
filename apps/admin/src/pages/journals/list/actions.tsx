import { TopToolbar, CreateButton, ExportButton, Form } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";
import { Box } from "@mui/material";
import { validSortableFields } from "../../../../../packages/shared/constants";
import { MultiFieldSearchBox } from "../../../components/form/MultiFieldSearchBox";

export const JournalListActions = () => (
    <Box sx={{ width: "100%" }}>
        <TopToolbar>
            <CreateButton />
            <ImportButton entity="journal" />
            <ExportButton />
        </TopToolbar>

        <Form>
            <MultiFieldSearchBox fields={validSortableFields.journal} />
        </Form>
    </Box>
);