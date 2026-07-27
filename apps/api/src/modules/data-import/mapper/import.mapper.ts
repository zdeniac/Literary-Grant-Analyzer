import { ImportFile, ImportRow } from "../types/import.types";
import { parse } from "csv-parse/sync";

export const toImportFile = (file: Express.Multer.File): ImportFile => {
    const csvString = file.buffer.toString('utf-8');
    
    const rows: ImportRow[] = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
    });

    return {
        fileName: file.originalname,
        mimeType: file.mimetype,
        header: Object.keys(rows[0]),
        rows: rows,
    };
}