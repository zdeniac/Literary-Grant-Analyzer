import { CreateButton, ExportButton, TopToolbar } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";

export const PersonListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ImportButton model="person" />
        <ExportButton />
    </TopToolbar>
);