import { TopToolbar, CreateButton, ExportButton, Form } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";
import { MultiFieldSearchBox } from "../../../components/form/MultiFieldSearchBox";
import { validSearchableFields } from "../../../../../packages/shared/constants";
import { Box } from "@mui/material";

export const DecisionAuthorityListActions = () => (
    <Box sx={{ width: "100%" }}>
        <TopToolbar>
            <CreateButton />
            <ImportButton entity="decisionAuthority" />
            <ExportButton />
        </TopToolbar>

        <Form>
            <MultiFieldSearchBox fields={validSearchableFields.decisionAuthority} />
        </Form>
    </Box>
);