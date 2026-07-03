import { DataTable, List, ReferenceField } from "react-admin";
import { JournalListActions } from "./actions";
import { AuditColumns } from "../../../features/import/components/AuditColumns";

export const JournalList = () => (
    <List actions={<JournalListActions />}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="issn" />
            <DataTable.Col source="status" />
            <DataTable.Col source="foundingYear" />

            <DataTable.Col>
                <ReferenceField source="organizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);