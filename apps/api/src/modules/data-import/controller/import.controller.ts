import { ImportService } from "../service/import.service";
import { Request, Response } from "express";
import { toImportFile } from "../mapper/import.mapper";
import { ImportSchemaService } from "../service/import-schema.service";
import { CrudService } from "../../../common/services/crud.service";
import { SourceDocumentModel } from "../../source-document/dto/source-document.dto";
import { CreateSourceDocumentInput } from "../../source-document/dto/source-document.input.dto";
import { createSourceDocumentSchema } from "../../source-document/validation/source-document.schema";
import z from "zod";

export class ImportController {
    constructor(
        private readonly importService: ImportService,
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

        if (!uploadedFile) {
            res.status(400).json({
                error: 'No file uploaded'
            });
            return;
        }

        const parsedFile = toImportFile(uploadedFile);

        let sourceDocuments: CreateSourceDocumentInput[] | undefined;

        if (req.body.saveSourceDocument) {
            /**
             * @todo: rethrow error as importvalidation error
             */
            sourceDocuments = z.array(createSourceDocumentSchema)
                .parse(req.body.sourceDocuments);        
        }

        const total = await this.importService.import(
            req.params.model as string,
            parsedFile,
            sourceDocuments,
        );

        res.json({
            data: { total }
        });
    }
}