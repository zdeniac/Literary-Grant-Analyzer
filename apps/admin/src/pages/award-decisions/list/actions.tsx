import { TopToolbar, CreateButton, ExportButton } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";

export const AwardDecisionListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ImportButton model="awardDecision" />
        <ExportButton />
    </TopToolbar>
);