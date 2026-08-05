import { CreateButton, ExportButton, TopToolbar } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";

export const AwardSchemeListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ImportButton entity="awardScheme" />
        <ExportButton />
    </TopToolbar>
);