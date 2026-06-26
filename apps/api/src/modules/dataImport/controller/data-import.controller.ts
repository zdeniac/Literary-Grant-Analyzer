import { DataImportService } from "../service/data-import.service";
import { Request, Response } from "express";
import { toImportFile } from "../mapper/data-import.mapper";
import { ImportSchemaService } from "../service/import-schema.service";
import { ImportValidationError } from "../error/data-import.errors";

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
        try {
            const uploadedFile = req.file;

            if (!uploadedFile) {
                res.status(400).json({
                    error: 'No file uploaded'
                });
                return;
            }

            const parsedFile = toImportFile(uploadedFile);

            const total = await this.importService.import(
                req.params.model as string,
                parsedFile
            );

            res.json({
                data: {
                    total
                }
            });

        } catch (error) {
            if (error instanceof ImportValidationError) {
                res.status(422).json({
                    error: error.message,
                    errors: error.errors
                });

                return;
            }

            throw error;
        }    
    }
}