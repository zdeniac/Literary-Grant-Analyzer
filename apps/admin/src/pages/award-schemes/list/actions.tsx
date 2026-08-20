import { CreateButton, ExportButton, Form, TopToolbar } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";
import { Box } from "@mui/material";
import { MultiFieldSearchBox } from "../../../components/form/MultiFieldSearchBox";
import { validSortableFields } from "../../../../../packages/shared/constants";

export const AwardSchemeListActions = () => (
    <Box sx={{ width: "100%" }}>
        <TopToolbar>
            <CreateButton />
            <ImportButton entity="awardScheme" />
            <ExportButton />
        </TopToolbar>

        <Form>
            <MultiFieldSearchBox fields={validSortableFields.awardScheme} />
        </Form>
    </Box>
);