import { DataTable, List } from "react-admin";
import { HungarianDateField } from "../../components/inputs/HungarianDateField";
import { DataImportModal } from "../../features/data-import/components/DataImportModal";
import { useState } from "react";

export const OrganizationList = () => {
    const [open, setOpen] = useState(false);

    return (
        <List>
            <button onClick={() => setOpen(true)}>
                Import
            </button>

            <DataImportModal model="organization" open={open} onClose={() => setOpen(false)} />

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