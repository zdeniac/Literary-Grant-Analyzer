import { TopToolbar, CreateButton, ExportButton } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";

export const DecisionAuthorityListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ImportButton model="decisionAuthority" />
        <ExportButton />
    </TopToolbar>
);