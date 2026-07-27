import { DataTable } from "react-admin";
import { HungarianDateField } from "./HungarianDateField";

export const AuditColumns = () => {
    return (
        <>
            <DataTable.Col source="createdAt" field={HungarianDateField} />
            <DataTable.Col source="updatedAt" field={HungarianDateField} />
        </>
    );
}