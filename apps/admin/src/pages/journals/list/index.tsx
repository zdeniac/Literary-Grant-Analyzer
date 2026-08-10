import { DataTable, FunctionField, Link, List } from "react-admin";
import { JournalListActions } from "./actions";
import { AuditColumns } from "../../../components/table/AuditColumns";
import { CustomEmpty } from "../../../components/table/CustomEmpty";
import { TableLink } from "../../../components/table/TableLink";

export const JournalList = () => (
    <List actions={<JournalListActions />} empty={<CustomEmpty hasImport entity="journal" />}>
        <DataTable>

            <DataTable.Col source="id" />

            <DataTable.Col source="name" />

            <DataTable.Col 
                source="issn" 
                render={record => {
                    const issn = record.issn;

                    if (!issn) {
                        return '';
                    }

                    return issn.length === 8
                        ? `${issn.slice(0, 4)}-${issn.slice(4)}`
                        : issn;
                    }
                }
            />

            <DataTable.Col source="status" />
            <DataTable.Col source="format" />
            <DataTable.Col source="foundingYear" />

            <DataTable.Col label="Organization(s)">
                <FunctionField
                    render={record =>
                        record.organizations
                            ?.map((org: { id: number; name: string }) => (
                                <TableLink to={`/organizations/${org.id}`}>
                                    {org.name}
                                </TableLink>
                            ))
                    }
                />
            </DataTable.Col>

            <AuditColumns />

        </DataTable>
    </List>
);