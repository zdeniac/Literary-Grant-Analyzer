import { DataTable, FunctionField, List } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";
import { AwardDecisionListActions } from "./actions";
import { HungarianDateField } from "../../../components/table/HungarianDateField";
import { TableLink } from "../../../components/table/TableLink";
import { HungarianNumberField } from "../../../components/table/HungarianNumberField";

export const AwardDecisionList = () => (
    <List 
        actions={<AwardDecisionListActions />} empty={<CustomEmpty hasImport entity="awardDecision" />}
        sort={{ field: 'id', order: 'DESC' }}
    >
        <DataTable>

            <DataTable.Col source="id" />

            <DataTable.Col source="recipientName" disableSort />
            <DataTable.Col source="awardSchemeName" disableSort />
            <DataTable.Col source="decisionMakerName" disableSort />
             
            <DataTable.Col source="amount" field={HungarianNumberField}/>
            <DataTable.Col source="purpose" />

            <DataTable.Col source="decisionDate" field={HungarianDateField}/>
            
            <DataTable.Col source="sourceIdentifier" />

            <DataTable.Col source="sourceDocumentTitle" disableSort >
                <FunctionField render={(record) => (
                    <TableLink to={`/source-documents/${record.sourceDocumentId}`}>
                        { record.sourceDocumentTitle }
                    </TableLink>
                )} />
            </DataTable.Col>

            <AuditColumns />

        </DataTable>
    </List>
);