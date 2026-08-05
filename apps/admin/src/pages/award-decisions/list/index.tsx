import { DataTable, List } from "react-admin";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";
import { AwardDecisionListActions } from "./actions";

export const AwardDecisionList = () => (
    <List actions={<AwardDecisionListActions />} empty={<CustomEmpty hasImport entity="awardDecision" />}>
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