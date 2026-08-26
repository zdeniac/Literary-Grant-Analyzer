import { DataTable, List, ReferenceField, UrlField } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { HungarianDateField } from "../../../components/table/HungarianDateField";
import { SourceDocumentActions } from "./actions";

export const SourceDocumentList = () => (
    <List
        actions={<SourceDocumentActions />}
        sort={{ field: 'id', order: 'DESC' }} 
    >
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />

            <DataTable.Col source="url" field={UrlField}/>

            <DataTable.Col source="retrievedAt" field={HungarianDateField}/>

            <DataTable.Col label="Issuing organization">
                <ReferenceField source="issuingOrganizationId" reference="organizations" />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);