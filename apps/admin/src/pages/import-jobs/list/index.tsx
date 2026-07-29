import { DataTable, List } from "react-admin";

export const ImportJobList = () => (
    <List>
        <DataTable>

            <DataTable.Col source="id" />
            <DataTable.Col source="fileName" />
            <DataTable.Col source="mimeType" />
            <DataTable.Col source="status" />

            <DataTable.Col source="totalRows" />
            <DataTable.Col source="importedRows" />
            <DataTable.Col source="failedRows" />

            {/* <DataTable.Col source="errorMessage" /> */}

            <DataTable.Col source="startedAt" />
            <DataTable.Col source="finishedAt" />

        </DataTable>
    </List>
);