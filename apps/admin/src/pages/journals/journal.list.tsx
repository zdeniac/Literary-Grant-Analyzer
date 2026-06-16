import { DataTable, List, ReferenceField } from "react-admin";
import { HungarianDateField } from "../../components/inputs/HungarianDateField";

export const JournalList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="issn" />
            <DataTable.Col source="status" />
            <DataTable.Col source="foundingYear" />

            <DataTable.Col>
                <ReferenceField source="organizationId" reference="organizations" />
            </DataTable.Col>

            <DataTable.Col source="createdAt" field={HungarianDateField}/>
            <DataTable.Col source="updatedAt" field={HungarianDateField} />
        </DataTable>
    </List>
);