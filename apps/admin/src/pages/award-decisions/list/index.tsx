import { DataTable, List } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";

export const AwardDecisionList = () => (
    <List>
        <DataTable>

            <DataTable.Col source="id" />

            <DataTable.Col source="awardSchemeName" />

            <DataTable.Col source="decisionMakerName" />

            <DataTable.Col source="recipientName" />

            <DataTable.Col source="sourceDocumentTitle" />

            <DataTable.Col source="amount" />

            <DataTable.Col source="purpose" />
            
            <DataTable.Col source="decisionDate" />

            <AuditColumns />

        </DataTable>
    </List>
);