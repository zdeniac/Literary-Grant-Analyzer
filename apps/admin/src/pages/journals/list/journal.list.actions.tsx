import { TopToolbar, CreateButton, ExportButton } from "react-admin";
import { ImportButton } from "../../../features/import/components/ImportButton";

export const JournalListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ImportButton model="journal" />
        <ExportButton />
    </TopToolbar>
);