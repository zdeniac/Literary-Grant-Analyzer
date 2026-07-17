import { DataTable, List, ReferenceField } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { AwardSchemeListActions } from "./actions";
import { CustomEmpty } from "../../../components/table/CustomEmpty";

export const AwardSchemeList = () => (
    <List actions={<AwardSchemeListActions />} empty={<CustomEmpty hasImport model="awardScheme" />}>
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
