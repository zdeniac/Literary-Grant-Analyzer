import { DataTable, List } from "react-admin";
import { OrganizationListActions } from "./actions";
import { AuditColumns } from "../../../components/table/AuditColumns";

export const OrganizationList = () => {
    return (
        <List actions={<OrganizationListActions />}>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="name" />
                <DataTable.Col source="address" />
                <DataTable.Col source="legalForm" />
                <DataTable.Col source="foundingYear" />

                <AuditColumns />
            </DataTable>
        </List>
    );
};