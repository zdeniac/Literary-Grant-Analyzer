import { DataImportService } from "../service/data-import.service";
import { Request, Response } from "express";
import { toImportFile } from "../mapper/data-import.mapper";
import { ImportSchemaService } from "../service/import-schema.service";

export class DataImportController {
    constructor(
        private readonly importService: DataImportService,
        private readonly schemaService: ImportSchemaService,
    ) {
        this.import = this.import.bind(this);
        this.getSchema = this.getSchema.bind(this);
    }

    public async getSchema(req: Request, res: Response): Promise<void>
    {
        const model = req.query.model as string | undefined;
        
        if (!model) {
            res.status(400).json({
                error: 'Missing model parameter'
            });
            return;
        }        
        res.json({ 
            data: this.schemaService.getSchema(model) 
        });
    }

    public async import(req: Request, res: Response): Promise<void>
    {
        const uploadedFile = req.file;

        if (!uploadedFile) throw new Error('No file uploaded.');

        const parsedFile = toImportFile(uploadedFile);

        const total = await this.importService.import(
            req.params.model as string, 
            parsedFile
        );

        res.json({ total });
    }
}