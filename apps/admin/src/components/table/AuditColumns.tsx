import { DataTable } from "react-admin";
import { HungarianDateField } from "./HungarianDateField";

export const AuditColumns = () => {
    return (
        <>
            <DataTable.Col label="Created at">
                <HungarianDateField source="createdAt" showTime />
            </DataTable.Col>
            <DataTable.Col label="Updated at ">
                <HungarianDateField source="updatedAt" showTime />
            </DataTable.Col>
        </>
    );
}