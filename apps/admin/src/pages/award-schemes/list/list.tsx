import { DataTable, List, ReferenceField } from "react-admin";
import { AuditColumns } from "../../../features/import/components/AuditColumns";
import { AwardSchemeListActions } from "./actions";

export const AwardSchemeList = () => (
    <List actions={<AwardSchemeListActions />}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="type" />

            <DataTable.Col>
                <ReferenceField source="organizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);
