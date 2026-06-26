import { DataTable, List } from "react-admin";
import { HungarianDateField } from "../../../components/inputs/HungarianDateField";
import { OrganizationListActions } from "./organization.list.actions";

export const OrganizationList = () => {
    return (
        <List actions={<OrganizationListActions />}>
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
};