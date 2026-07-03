import { DataTable, List, ReferenceField } from "react-admin";
import { DecisionBodyListActions } from "./actions";
import { AuditColumns } from "../../../features/import/components/AuditColumns";

export const DecisionBodyList = () => (
    <List actions={<DecisionBodyListActions />}>
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