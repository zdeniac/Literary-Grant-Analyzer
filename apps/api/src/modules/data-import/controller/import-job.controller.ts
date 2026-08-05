import { Request, Response } from "express";
import { ImportJobService } from "../service/import-job.service";
import { sendData } from "../../../common/http/response";
import { toImportJobDto } from "../mapper/import-job.mapper";

export class ImportJobController
{
    constructor(
        private readonly importJobService: ImportJobService
    ) {
        this.findAll = this.findAll.bind(this);
    }

    async findAll(req: Request, res: Response): Promise<void>
    {
        const importJobs = await this.importJobService.findAll();

        sendData(
            res, 
            importJobs.map(toImportJobDto), 
            { total: importJobs.length }
        );
    }
}