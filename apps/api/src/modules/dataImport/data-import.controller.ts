import { DataImportService } from "./data-import.service";
import { Request, Response } from "express";
import { toImportFile } from "./mapper/data-import.mapper";

export class DataImportController {
    constructor(
        private readonly service: DataImportService
    ) {
        this.import = this.import.bind(this);
    }

    public async import(req: Request, res: Response): Promise<void>
    {
        const uploadedFile = req.file;

        if (!uploadedFile) throw new Error();

        const parsedFile = toImportFile(uploadedFile);

        const count = await this.service.import(
            req.params.model as string, 
            parsedFile
        );

        res.json({ count });
    }
}