import { Datagrid, List, TextField } from "react-admin";

export const OrganizationList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="address" />
            <TextField source="legalForm" />
            <TextField source="foundingYear" />
            <TextField source="createdAt" />
            <TextField source="updatedAt" />
        </Datagrid>
    </List>
);