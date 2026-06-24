import { prisma } from "../../db/prisma";
import { dataImporterBlueprints } from "./blueprint/data-import.blueprints";
import { DataImportController } from "./data-import.controller";
import { DataImportRepository } from "./data-import.repository";
import { DataImportService } from "./data-import.service";

export const createDataImportModule = () => {
   const service = new DataImportService(
        dataImporterBlueprints,
        {
            journal: new DataImportRepository(prisma.journal),
            organization: new DataImportRepository(prisma.organization),
        }
    );

    return {
        controller: new DataImportController(service),
    }
};