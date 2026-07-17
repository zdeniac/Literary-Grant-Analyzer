import { prisma } from "../../db/prisma";
import { DataImportController as ImportController } from "./controller/import.controller";
import { PrismaImportTargetRepository, } from "../../db/repositories/prisma-import-target.repository";
import { ImportBlueprintRegistry } from "./registry/import-blueprint.registry";
import { ImportService as ImportService } from "./service/import.service";
import { ImportSchemaService } from "./service/import-schema.service";
import { RelationResolver } from "./resolver/relation-resolver";
import { OrganizationImportWriter } from "../organization/import/writer";
import { DataImportWriter } from "./handler/writer";
import { DataImportLookup } from "./handler/lookup";
import { AwardScheme, DecisionBody, Journal, Organization } from "@prisma/client";
import { ImportOptions, ImportRow } from "./types/import.types";
import { decisionBodyBlueprint } from "../decision-body/import/decision-body.blueprint";
import { DecisionBodyImportWriter } from "../decision-body/import/writer";
import { awardSchemeBlueprint } from "../award-scheme/import/award-scheme.blueprint";
import { organizationBlueprint } from "../organization/import/organization.blueprint";
import { journalBlueprint } from "../journal/import/journal.blueprint";

export const createImportModule = () => {
    const registry = new ImportBlueprintRegistry(
        journalBlueprint, 
        organizationBlueprint,
        awardSchemeBlueprint,
        decisionBodyBlueprint,
    );

    const repositories = {
        journal: new PrismaImportTargetRepository<Journal, ImportRow>(prisma.journal),
        organization: new PrismaImportTargetRepository<Organization, ImportRow>(prisma.organization),
        awardScheme: new PrismaImportTargetRepository<AwardScheme, ImportRow>(prisma.awardScheme),
        decisionBody: new PrismaImportTargetRepository<DecisionBody, ImportRow>(prisma.decisionBody),
    };

    const writers = {
        journal: new DataImportWriter(repositories.journal),
        organization: new OrganizationImportWriter(),
        awardScheme: new DataImportWriter(repositories.awardScheme),
        decisionBody: new DecisionBodyImportWriter(),
    };

    const lookups = {
        journal: new DataImportLookup(repositories.journal),
        organization: new DataImportLookup(repositories.organization),
        awardScheme: new DataImportLookup(repositories.awardScheme),
        decisionBody: new DataImportLookup(repositories.decisionBody)
    }

    const options: ImportOptions = {
        validation: {
            allowUnknownFields: true,
        }
    };

    const relationResolver = new RelationResolver(lookups);
    const importService = new ImportService(registry, writers, relationResolver, options);
    const schemaService = new ImportSchemaService(registry);
    const controller = new ImportController(importService, schemaService);

    return {
        controller,
        service: importService,
    }
};