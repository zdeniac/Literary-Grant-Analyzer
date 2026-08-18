import { DataTable, List, UrlField } from "react-admin";
import { OrganizationListActions } from "./actions";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";
import { TruncateField } from "../../../components/table/TruncateField";

export const OrganizationList = () => {
    return (
        <List 
            actions={<OrganizationListActions />} empty={<CustomEmpty hasImport entity="organization" />}
            sort={{ field: 'id', order: 'DESC' }}
        >
            <DataTable>

                <DataTable.Col source="id" />
                <DataTable.Col source="name" />
                <DataTable.Col source="website" field={UrlField} />
                <DataTable.Col source="address" field={TruncateField}/>

                <DataTable.Col source="foundingYear" />
                <DataTable.Col source="legalForm" />
                <DataTable.Col source="sector" />

                <AuditColumns />
                
            </DataTable>
        </List>
    );
};