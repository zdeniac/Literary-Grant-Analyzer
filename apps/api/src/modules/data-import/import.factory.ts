import { prisma } from "../../db/prisma";
import { ImportController } from "./import.controller";
import { ImportTargetRepository, } from "./repository/import-target.repository";
import { ImportBlueprintRegistry } from "./registry/import-blueprint.registry";
import { ImportService as ImportService } from "./service/import.service";
import { ImportSchemaService } from "./service/import-schema.service";
import { RelationResolver } from "./resolver/relation-resolver";
import { OrganizationImportWriter } from "../organization/import/organization.writer";
import { ImportWriter } from "./handler/writer";
import { ImportLookup } from "./handler/lookup";
import { AwardScheme, DecisionBody, Journal, Organization } from "@prisma/client";
import { ImportOptions, ImportRow } from "./types/import.types";
import { decisionBodyBlueprint } from "../decision-body/import/decision-body.blueprint";
import { DecisionBodyImportWriter } from "../decision-body/import/decision-body.writer";
import { awardSchemeBlueprint } from "../award-scheme/import/award-scheme.blueprint";
import { organizationBlueprint } from "../organization/import/organization.blueprint";
import { journalBlueprint } from "../journal/import/journal.blueprint";
import { ImportJobRepository } from "./repository/import-job.repository";

export const createImportModule = () => {
    const registry = new ImportBlueprintRegistry(
        journalBlueprint, 
        organizationBlueprint,
        awardSchemeBlueprint,
        decisionBodyBlueprint,
    );

    const repositories = {
        journal: new ImportTargetRepository<Journal, ImportRow>(prisma.journal),
        organization: new ImportTargetRepository<Organization, ImportRow>(prisma.organization),
        awardScheme: new ImportTargetRepository<AwardScheme, ImportRow>(prisma.awardScheme),
        decisionBody: new ImportTargetRepository<DecisionBody, ImportRow>(prisma.decisionBody),
    };

    const lookups = {
        journal: new ImportLookup(repositories.journal),
        organization: new ImportLookup(repositories.organization),
        awardScheme: new ImportLookup(repositories.awardScheme),
        decisionBody: new ImportLookup(repositories.decisionBody)
    }

    const writers = {
        journal: new ImportWriter(repositories.journal),
        organization: new OrganizationImportWriter(),
        awardScheme: new ImportWriter(repositories.awardScheme),
        decisionBody: new DecisionBodyImportWriter(),
    };

    const options: ImportOptions = {
        validation: {
            allowUnknownFields: true,
        }
    };

    const relationResolver = new RelationResolver(lookups);
    const repository = new ImportJobRepository(prisma.importJob);

    const importService = new ImportService(
        repository,
        registry,
        writers,
        relationResolver,
        options
    );

    const schemaService = new ImportSchemaService(registry);

    const controller = new ImportController(importService, schemaService);

    return {
        controller,
        service: importService,
    }
};