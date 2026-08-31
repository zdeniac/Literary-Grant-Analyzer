import { DataTable, FunctionField, List, Pagination } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";
import { AwardDecisionListActions } from "./actions";
import { HungarianDateField } from "../../../components/table/HungarianDateField";
import { TableLink } from "../../../components/table/TableLink";
import { HungarianNumberField } from "../../../components/table/HungarianNumberField";
import { DecisionMaker, Recipient } from "../../../../../packages/shared/enums";
import { TruncateField } from "../../../components/table/TruncateField";

export const AwardDecisionList = () => (
    <List
        actions={<AwardDecisionListActions />} empty={<CustomEmpty hasImport entity="awardDecision" />}
        sort={{ field: 'id', order: 'DESC' }}
        pagination={<Pagination rowsPerPageOptions={[5, 10, 15, 30, 60, 120, 240, 500, 1000]} />}
    >
        <DataTable>

            <DataTable.Col source="id" />

            <DataTable.Col source="recipientName" disableSort>
                <FunctionField render={(record) => {
                    const id = record.recipientId;
                    const link = record.recipientType == Recipient.ORGANIZATION 
                        ? `/organizations/${id}`
                        : `/persons/${id}`;

                    return (
                        <TableLink to={link}>
                            { record.recipientName }
                        </TableLink>
                    );
                }} />
            </DataTable.Col>

            <DataTable.Col source="awardSchemeName" disableSort>
                <FunctionField render={(record) => (
                    <TableLink to={`/award-schemes/${record.awardSchemeId}`}>
                        { record.awardSchemeName }
                    </TableLink>
                )} />
            </DataTable.Col>

            <DataTable.Col source="decisionMakerName" disableSort >
                <FunctionField render={(record) => {
                    const id = record.decisionMakerId;
                    const link = record.decisionMakerType == DecisionMaker.ORGANIZATION 
                        ? `/organizations/${id}`
                        : `/decision-authorities/${id}`;

                    return (
                        <TableLink to={link}>
                            { record.decisionMakerName }
                        </TableLink>
                    );
                }} />
            </DataTable.Col>
             
            <DataTable.Col source="amount" field={HungarianNumberField}/>
            <DataTable.Col label="Purpose">
                <TruncateField source="purpose"/>
            </DataTable.Col>

            <DataTable.Col source="decisionDate" field={HungarianDateField}/>
            
            <DataTable.Col source="sourceIdentifier" />

            <DataTable.Col label="Source document" disableSort>
                <FunctionField render={(record) => (
                    <TableLink to={`/source-documents/${record.sourceDocumentId}`}>
                        <TruncateField source="sourceDocumentTitle">
                            { record.sourceDocumentTitle }
                        </TruncateField>
                    </TableLink>
                )} />
            </DataTable.Col>

            <AuditColumns />

        </DataTable>
    </List>
);