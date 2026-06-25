import { prisma } from "../../db/prisma";
import { dataImporterBlueprints } from "./blueprint/data-import.blueprints";
import { DataImportController } from "./controller/data-import.controller";
import { PrismaImportTargetRepository, } from "../../db/prisma-import-target.repository";
import { ImportBlueprintRegistry } from "./registry/import-blueprint.registry";
import { DataImportService } from "./service/data-import.service";
import { ImportSchemaService } from "./service/import-schema.service";

export const createDataImportModule = () => {
    const registry = new ImportBlueprintRegistry(dataImporterBlueprints);
    const repositories = {
        journal: new PrismaImportTargetRepository(prisma.journal),
        organization: new PrismaImportTargetRepository(prisma.organization),
    };

    const importService = new DataImportService(registry, repositories);
    const schemaService = new ImportSchemaService(registry);

    const controller = new DataImportController(importService, schemaService);

    return {
        controller,
    }
};