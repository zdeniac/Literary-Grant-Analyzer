import { DataTable, List, UrlField } from "react-admin";
import { OrganizationListActions } from "./actions";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";

export const OrganizationList = () => {
    return (
        <List actions={<OrganizationListActions />} empty={<CustomEmpty hasImport model="organization" />}>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="name" />
                <DataTable.Col source="website" field={UrlField} />
                <DataTable.Col source="address" />
                <DataTable.Col source="legalForm" />
                <DataTable.Col source="sector" />

                <AuditColumns />
            </DataTable>
        </List>
    );
};