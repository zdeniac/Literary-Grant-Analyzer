import { dataImporterBlueprints } from "./blueprint/data-import.blueprints";
import { DataImportService } from "./data-import.service";

//@todo add param type?
export const createDataImportModule = (repositories: {}) => {
   const service = new DataImportService(
        dataImporterBlueprints,
        repositories
    );

    return {
        service,
    }
};