import { prisma } from "../../db/prisma";
import { DataImportController as ImportController } from "./controller/import.controller";
import { PrismaImportTargetRepository, } from "../../db/prisma-import-target.repository";
import { ImportBlueprintRegistry } from "./registry/import-blueprint.registry";
import { ImportService as ImportService } from "./service/import.service";
import { ImportSchemaService } from "./service/import-schema.service";
import { RelationResolver } from "./resolver/relation-resolver";
import { journalBlueprint } from "./blueprint/journal.blueprint";
import { organizationBlueprint } from "./blueprint/organization.blueprint";
import { OrganizationImportWriter } from "../organization/import/handler";
import { ActorRepository } from "../actor/actor.repository";
import { OrganizationRepository } from "../organization/organization.repository";
import { DataImportWriter } from "./handler/writer";
import { DataImportLookup } from "./handler/lookup";

export const createImportModule = () => {
    const registry = new ImportBlueprintRegistry(journalBlueprint, organizationBlueprint);

    const repositories = {
        journal: new PrismaImportTargetRepository(prisma.journal),
        organization: new OrganizationRepository(prisma),
    };

    const writers = {
        journal: new DataImportWriter(repositories.journal),
        organization: new OrganizationImportWriter(
            new OrganizationRepository(prisma), 
            new ActorRepository(prisma)
        )
    };

    const lookups = {
        journal: new DataImportLookup(repositories.journal),
        organization: new DataImportLookup(
            new PrismaImportTargetRepository(prisma.organization)
        ),
    }

    const relationResolver = new RelationResolver(lookups);
    const importService = new ImportService(registry, writers, relationResolver);
    const schemaService = new ImportSchemaService(registry);
    const controller = new ImportController(importService, schemaService);

    return {
        controller,
    }
};