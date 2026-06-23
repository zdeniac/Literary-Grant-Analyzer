import { PrismaRepository } from "../../db/repository";
import { dataImporterBlueprints } from "./blueprint/data-import.blueprints";
import { DataImportService } from "./data-import.service";
import { Model } from "../../db/types";

export const createDataImportModule = <T extends Record<string, unknown>>(delegate: Model) => {
    const service = new DataImportService(
        dataImporterBlueprints,
        new PrismaRepository<T>(delegate)
    );

    return {
        service,
    }
};