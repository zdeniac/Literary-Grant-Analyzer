import { DataTable, List, ReferenceField } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { HungarianDateField } from "../../../components/table/HungarianDateField";

export const SourceDocumentList = () => (
    <List sort={{ field: 'id', order: 'DESC' }} >
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="url" />
            <DataTable.Col source="retrievedAt" field={HungarianDateField}/>

            <DataTable.Col label="Issuing organization">
                <ReferenceField source="issuingOrganizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);