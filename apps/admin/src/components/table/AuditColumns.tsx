import { DataTable } from "react-admin";

export const AuditColumns = () => {
    return (
        <>
            <DataTable.Col source="createdAt" />
            <DataTable.Col source="updatedAt" />
        </>
    );
}