import { ImportFile } from "../types/data-import.types";
import { parse } from "csv-parse/sync";

export const toImportFile = (file: Express.Multer.File): ImportFile => {
    const csvString = file.buffer.toString('utf-8');
    
    // @todo: ImportRow type
    const rows: Record<string, unknown>[] = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
    });
    console.log(rows);

    return {
        name: file.originalname,
        mimeType: file.mimetype,
        header: Object.keys(rows[0]),
        rows: rows,
    };
}