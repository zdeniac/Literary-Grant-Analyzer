import { DataTable, List, ReferenceField } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { AwardSchemeListActions } from "./actions";
import { CustomEmpty } from "../../../components/table/CustomEmpty";
import { TruncateField } from "../../../components/table/TruncateField";

export const AwardSchemeList = () => (
    <List 
        actions={<AwardSchemeListActions />} empty={<CustomEmpty hasImport entity="awardScheme" />}
         sort={{ field: 'id', order: 'DESC' }}
    >
        <DataTable>

            <DataTable.Col source="id" />

            <DataTable.Col 
                source="name" 
                field={
                    () => TruncateField({ source: 'name', maxWidth: 45 })
                } 
            />
            <DataTable.Col source="type" />
            <DataTable.Col source="fundingArea" />

            <DataTable.Col label="Organization">
                <ReferenceField source="organizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
            
        </DataTable>
    </List>
);
