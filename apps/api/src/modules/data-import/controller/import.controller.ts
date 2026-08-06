import z from "zod";
import { Request, Response } from "express";
import { toImportFile } from "../mapper/import.mapper";
import { ImportSchemaService } from "../service/import-schema.service";
import { CreateSourceDocumentInput } from "../../source-document/dto/source-document.input.dto";
import { createSourceDocumentSchema } from "../../source-document/validation/source-document.schema";
import { ImportError } from "../error/import.errors";
import { ImportWorkflowService } from "../service/import-workflow-service";
import { ImportableEntityName } from "../constants/importable-models";
import { entityNameSchema } from "../../../common/validation/schema";

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
        const entity = typeof req.query.entity === 'string'
            ? req.query.entity
            : undefined;

        const parsedEntity = entityNameSchema.safeParse(entity);
        if (!parsedEntity.success) {
            res.status(400).json({
                error: 'Invalid or missing entity parameter'
            });
            return;
        }

        res.json({ 
            data: this.schemaService.getSchema(parsedEntity.data as ImportableEntityName) 
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

        const parsedEntity = entityNameSchema.safeParse(req.params.entity);

        if (!parsedEntity.success) {
            res.status(400).json({
                error: 'Invalid entity parameter'
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
                    throw new ImportError('IMPORT_SOURCE_DOCUMENTS_ERROR');
                }

                throw e;
            }
        }

        const importJob = 
            await this.importWorkflowService.import(
                parsedEntity.data as ImportableEntityName, 
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