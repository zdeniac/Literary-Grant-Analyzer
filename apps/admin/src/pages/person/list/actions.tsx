import { CreateButton, ExportButton, Form, TopToolbar } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";
import { Box } from "@mui/material";
import { MultiFieldSearchBox } from "../../../components/form/MultiFieldSearchBox";
import { validSearchableFields } from "../../../../../packages/shared/constants";

export const PersonListActions = () => (
    <Box sx={{ width: "100%" }}>
        <TopToolbar>
            <CreateButton />
            <ImportButton entity="person" />
            <ExportButton />
        </TopToolbar>

        <Form>
            <MultiFieldSearchBox fields={validSearchableFields.person} />
        </Form>
    </Box>
);