import { TopToolbar, CreateButton, ExportButton } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";

export const OrganizationListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ImportButton model="organization" />
        <ExportButton />
    </TopToolbar>
);