import { DataTable, FunctionField, Link, List } from "react-admin";
import { JournalListActions } from "./actions";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";

export const JournalList = () => (
    <List actions={<JournalListActions />} empty={<CustomEmpty hasImport model="journal" />}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="issn" />
            <DataTable.Col source="status" />
            <DataTable.Col source="format" />
            <DataTable.Col source="foundingYear" />

            <DataTable.Col label="Organization">
                <FunctionField
                    render={(record) =>
                        record.organizations
                            ?.map((org: { id: number; name: string }) => (
                                <Link
                                    key={org.id}
                                    to={`/organizations/${org.id}/edit`}
                                    style={{ display: 'block' }}
                                    onClick={event => event.stopPropagation()}
                                >
                                    {org.name}
                                </Link>
                            ))
                    }
                />
            </DataTable.Col>

            <AuditColumns />
        </DataTable>
    </List>
);