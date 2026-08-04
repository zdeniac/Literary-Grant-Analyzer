import { DataTable, List } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";
import { PersonListActions } from "./actions";

export const PersonList = () => (
    <List actions={<PersonListActions />} empty={<CustomEmpty hasImport model="person" />}>
        <DataTable>

            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="birthYear" />
            <DataTable.Col source="deathYear" />
            <DataTable.Col source="roles" />

            <AuditColumns />
        </DataTable>
    </List>
);