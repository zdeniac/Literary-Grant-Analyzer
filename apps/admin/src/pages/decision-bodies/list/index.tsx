import { DataTable, List, ReferenceField } from "react-admin";
import { DecisionBodyListActions } from "./actions";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";

export const DecisionBodyList = () => (
    <List actions={<DecisionBodyListActions />} empty={<CustomEmpty hasImport model="decisionBody" />}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />

            <DataTable.Col>
                <ReferenceField source="organizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);