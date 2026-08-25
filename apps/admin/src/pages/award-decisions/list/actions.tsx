import { TopToolbar, CreateButton, ExportButton, Form, useListContext } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";
import { Box } from "@mui/material";
import { validSearchableFields } from "../../../../../packages/shared/constants";
import { MultiFieldSearchBox } from "../../../components/form/MultiFieldSearchBox";

export const AwardDecisionListActions = () => {
    const { filterValues } = useListContext();
    return (
        <Box sx={{ width: "100%" }}>
            <TopToolbar>
                <CreateButton />
                <ImportButton entity="awardDecision" />
                <ExportButton />
            </TopToolbar>
            
            <Form
                defaultValues={{
                    q: filterValues.q ?? '',
                    fields: filterValues.fields ?? [],
                }}>
                <MultiFieldSearchBox fields={validSearchableFields.awardDecision} />
            </Form>
        </Box>
    );
};