import { DataTable, List, ReferenceField } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { HungarianDateField } from "../../../components/table/HungarianDateField";

export const SourceDocumentList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="url" />
            <DataTable.Col source="retrievedAt" field={HungarianDateField}/>

            <DataTable.Col>
                <ReferenceField source="issuingOrganizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);