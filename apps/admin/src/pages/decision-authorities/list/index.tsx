import { DataTable, List, ReferenceField } from "react-admin";
import { DecisionAuthorityListActions } from "./actions";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";

export const DecisionAuthorityList = () => (
    <List 
        actions={<DecisionAuthorityListActions />} empty={<CustomEmpty hasImport entity="decisionAuthority" />}
        sort={{ field: 'id', order: 'DESC' }}
    >
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />

            <DataTable.Col label="Organization">
                <ReferenceField source="organizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);