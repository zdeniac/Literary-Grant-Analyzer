import { FileDelimiter } from "../../../../../packages/shared/enums";
import { ImportError } from "../error/import.errors";
import { ImportFile, ImportRow } from "../types/import.types";
import { CsvError, parse } from "csv-parse/sync";

export const toImportFile = (file: Express.Multer.File, delimiter: FileDelimiter): ImportFile => {
    let rows: ImportRow[] = [];

    try {
        rows = parse(file.buffer.toString('utf-8'), {
            columns: true,
            skip_empty_lines: true,
            delimiter,
            trim: true,
        });
    } catch (e: unknown) {
        if (e instanceof CsvError) {
            throw new ImportError(e.message);
        }
    }
    
    return {
        fileName: file.originalname,
        mimeType: file.mimetype,
        header: Object.keys(rows[0]),
        rows: rows,
    };
}