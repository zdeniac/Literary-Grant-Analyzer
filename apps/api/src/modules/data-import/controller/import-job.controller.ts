import { Request, Response } from "express";
import { ImportJobService } from "../service/import-job.service";
import { sendData } from "../../../common/http/response";
import { toImportJobDto } from "../mapper/import-job.mapper";
import { idSchema } from "../../../common/validation/schema";
import { toImportJobWithSourceDocumentsDto } from "../mapper/import-job-with-source-documents.mapper";

export class ImportJobController
{
    constructor(
        private readonly service: ImportJobService
    ) {
        this.list = this.list.bind(this);
        this.show = this.show.bind(this);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const importJobs = await this.service.getList(req.listQueryParams);

        sendData(
            res, 
            importJobs.map(toImportJobWithSourceDocumentsDto), 
            { total: importJobs.length }
        );
    }

    async show(req: Request, res: Response): Promise<void>
    {
        const importJob = await this.service.findByIdWithSourceDocuments(
            idSchema.parse(req.params.id),
        );

        sendData(res, toImportJobWithSourceDocumentsDto(importJob));
    }
}