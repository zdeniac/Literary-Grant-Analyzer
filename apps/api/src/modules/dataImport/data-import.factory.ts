import { dataImporterBlueprints } from "./data-import.blueprints";
import { DataImportService } from "./data-import.service";

export const createDataImportModule = () => {
    const service = new DataImportService(dataImporterBlueprints);

    return {
        service,
    }
};