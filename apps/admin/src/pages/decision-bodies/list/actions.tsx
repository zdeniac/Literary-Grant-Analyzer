import { TopToolbar, CreateButton, ExportButton } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";

export const DecisionBodyListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ImportButton model="decisionBody" />
        <ExportButton />
    </TopToolbar>
);