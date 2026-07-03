import { DataTable } from "react-admin";
import { HungarianDateField } from "../../../components/inputs/HungarianDateField";

export const AuditColumns = () => {
    return (
        <>
            <DataTable.Col source="createdAt" field={HungarianDateField} />
            <DataTable.Col source="updatedAt" field={HungarianDateField} />
        </>
    );
}