import { DataTable, FunctionField, List } from "react-admin";
import { HungarianDateField } from "../../../components/table/HungarianDateField";
import { TableLink } from "../../../components/table/TableLink";
import { ImportJobStatusField } from "../components/ImportJobStatusField";

export const ImportJobList = () => (
    <List sort={{ field: 'id', order: 'DESC' }} >
        <DataTable>

            <DataTable.Col source="id" />            
            
            <DataTable.Col source="model" />

            <DataTable.Col label="Source documents" disableSort>
                <FunctionField
                    render={record =>
                        record.sourceDocuments
                            ?.map((sourceDocument: { id: number; title: string }) => (
                                <TableLink key={sourceDocument.id} to={`/source-documents/${sourceDocument.id}`}>
                                    {sourceDocument.title}
                                </TableLink>
                            ))
                    }
                />
            </DataTable.Col>

            <DataTable.Col source="fileName" />
            <DataTable.Col source="mimeType" />
            <DataTable.Col source="status" field={ImportJobStatusField}/>

            <DataTable.Col source="totalRows" />
            <DataTable.Col source="importedRows" />
            <DataTable.Col source="failedRows" />

            <DataTable.Col label="Started at">
                <HungarianDateField source="startedAt" showTime />
            </DataTable.Col>

            <DataTable.Col label="Finished at">
                <HungarianDateField source="finishedAt" showTime />
            </DataTable.Col>
        </DataTable>
    </List>
);