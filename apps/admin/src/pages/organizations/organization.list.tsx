import { DataTable, List } from "react-admin";
import { HungarianDateField } from "../../components/inputs/HungarianDateField";

export const OrganizationList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="address" />
            <DataTable.Col source="legalForm" />
            <DataTable.Col source="foundingYear" />

            <DataTable.Col source="createdAt" field={HungarianDateField} />
            <DataTable.Col source="updatedAt" field={HungarianDateField} />
        </DataTable>
    </List>
);