import z from "zod";
import { ImportService } from "../service/import.service";
import { Request, Response } from "express";
import { toImportFile } from "../mapper/import.mapper";
import { ImportSchemaService } from "../service/import-schema.service";
import { CreateSourceDocumentInput } from "../../source-document/dto/source-document.input.dto";
import { createSourceDocumentSchema } from "../../source-document/validation/source-document.schema";
import { ImportError } from "../error/import.errors";
import { modelNameSchema } from "../validation/data-import.validation.schema";
import { SourceDocumentService } from "../../source-document/source-document.service";
import { ModelName } from "../types/import.types";
import { ImportJobSourceDocumentService } from "../../import-job-source-document/import-job-source-document.service";
import { SourceDocumentDto } from "../../source-document/dto/source-document.dto";
import { ImportWorkflowService } from "../service/import-workflow-service";

export class ImportController
{
    constructor(
        private readonly importWorkflowService: ImportWorkflowService,
        private readonly schemaService: ImportSchemaService,
    ) {
        this.import = this.import.bind(this);
        this.getSchema = this.getSchema.bind(this);
        this.validateSourceDocuments = this.validateSourceDocuments.bind(this);
    }

    public async getSchema(req: Request, res: Response): Promise<void>
    {
        const model = typeof req.query.model === 'string'
            ? req.query.model
            : undefined;

        const parsedModel = modelNameSchema.safeParse(model);
        if (!parsedModel.success) {
            res.status(400).json({
                error: 'Invalid or missing model parameter'
            });
            return;
        }

        res.json({ 
            data: this.schemaService.getSchema(parsedModel.data as ModelName) 
        });
    }

    public async import(req: Request, res: Response): Promise<void>
    {
        if (!req.file) {
            res.status(400).json({
                error: 'No file uploaded'
            });
            return;
        }

        const parsedModel = modelNameSchema.safeParse(req.params.model);

        if (!parsedModel.success) {
            res.status(400).json({
                error: 'Invalid model parameter'
            });
            return;
        }

        let sourceDocuments: CreateSourceDocumentInput[] = [];

        if (req.body.saveSourceDocument === 'true') {
            try {
                sourceDocuments = this.validateSourceDocuments(
                    req.body.sourceDocuments
                );
            } catch (e: unknown) {
                if (e instanceof z.ZodError) {
                    throw new ImportError(
                        'IMPORT_SOURCE_DOCUMENTS_ERROR'
                    );
                }

                throw e;
            }
        }

        const importJob = 
            await this.importWorkflowService.import(
                parsedModel.data as ModelName, 
                toImportFile(req.file), 
                sourceDocuments
            );

        res.json({
            data: {
                total: importJob.totalRows
            }
        });    
    }

    private validateSourceDocuments(sourceDocuments: any[]): CreateSourceDocumentInput[]
    {
        return z.array(createSourceDocumentSchema)
            .parse(sourceDocuments);        
    }
}