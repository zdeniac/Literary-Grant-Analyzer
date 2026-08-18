import { DataTable, List } from "react-admin";

export const ImportJobList = () => (
    <List sort={{ field: 'id', order: 'DESC' }} >
        <DataTable>

            <DataTable.Col source="id" />
            
            <DataTable.Col source="model" />
            <DataTable.Col source="fileName" />
            <DataTable.Col source="mimeType" />
            <DataTable.Col source="status" />

            <DataTable.Col source="totalRows" />
            <DataTable.Col source="importedRows" />
            <DataTable.Col source="failedRows" />

            <DataTable.Col source="startedAt" />
            <DataTable.Col source="finishedAt" />

        </DataTable>
    </List>
);