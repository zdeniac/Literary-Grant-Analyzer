import { DataTable, List } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";

export const SourceDocumentList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="url" />
            <DataTable.Col source="retrievedAt" />

            <AuditColumns />
        </DataTable>
    </List>
);