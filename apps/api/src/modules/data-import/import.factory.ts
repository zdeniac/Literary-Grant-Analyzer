import { prisma } from "../../db/prisma";
import { DataImportController as ImportController } from "./controller/import.controller";
import { PrismaImportTargetRepository, } from "../../db/prisma-import-target.repository";
import { ImportBlueprintRegistry } from "./registry/import-blueprint.registry";
import { ImportService as ImportService } from "./service/import.service";
import { ImportSchemaService } from "./service/import-schema.service";
import { RelationResolver } from "./resolver/relation.resolver";
import { journalBlueprint } from "./blueprint/journal.blueprint";
import { organizationBlueprint } from "./blueprint/organization.blueprint";

export const createImportModule = () => {
    const registry = new ImportBlueprintRegistry(journalBlueprint, organizationBlueprint);
    const repositories = {
        journal: new PrismaImportTargetRepository(prisma.journal),
        organization: new PrismaImportTargetRepository(prisma.organization),
    };
    const relationResolver = new RelationResolver(repositories);

    const importService = new ImportService(registry, repositories, relationResolver);
    const schemaService = new ImportSchemaService(registry);

    const controller = new ImportController(importService, schemaService);

    return {
        controller,
    }
};