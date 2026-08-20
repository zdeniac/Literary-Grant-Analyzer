import { TopToolbar, CreateButton, ExportButton, Form } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";
import { Box } from "@mui/material";
import { MultiFieldSearchBox } from "../../../components/form/MultiFieldSearchBox";
import { validSortableFields } from "../../../../../packages/shared/constants";

export const OrganizationListActions = () => (
    <Box sx={{ width: "100%" }}>
        <TopToolbar>
            <CreateButton />
            <ImportButton entity="organization" />
            <ExportButton />
        </TopToolbar>

        <Form>
            <MultiFieldSearchBox fields={validSortableFields.organization} />
        </Form>
    </Box>
);