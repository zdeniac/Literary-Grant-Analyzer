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
import { ImportOptions, ImportRow } from "./types/import.types";
import { decisionBodyBlueprint } from "../decision-body/import/decision-body.blueprint";
import { DecisionBodyImportWriter } from "../decision-body/import/decision-body.writer";
import { awardSchemeBlueprint } from "../award-scheme/import/award-scheme.blueprint";
import { organizationBlueprint } from "../organization/import/organization.blueprint";
import { journalBlueprint } from "../journal/import/journal.blueprint";
import { ImportJobRepository } from "./repository/import-job.repository";
import { JournalImportWriter } from "../journal/import/journal.writer";
import { CrudService } from "../../common/services/crud.service";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { CreateSourceDocumentInput, UpdateSourceDocumentInput } from "../source-document/dto/source-document.input.dto";
import { SourceDocumentModel } from "../source-document/dto/source-document.dto";
import { JournalModel } from "../journal/dto/journal.dto";
import { OrganizationModel } from "../organization/dto/organization.dto";
import { AwardSchemeModel } from "../award-scheme/dto/award-scheme.dto";
import { DecisionBodyModel } from "../decision-body/dto/decision-body.dto";

export const createImportModule = () => {
    const registry = new ImportBlueprintRegistry(
        journalBlueprint, 
        organizationBlueprint,
        awardSchemeBlueprint,
        decisionBodyBlueprint,
    );

    const importRepos = {
        journal: new ImportTargetRepository<JournalModel, ImportRow>(prisma.journal),
        organization: new ImportTargetRepository<OrganizationModel, ImportRow>(prisma.organization),
        awardScheme: new ImportTargetRepository<AwardSchemeModel, ImportRow>(prisma.awardScheme),
        decisionBody: new ImportTargetRepository<DecisionBodyModel, ImportRow>(prisma.decisionBody),
    };

    const lookups = {
        journal: new ImportLookup(importRepos.journal),
        organization: new ImportLookup(importRepos.organization),
        awardScheme: new ImportLookup(importRepos.awardScheme),
        decisionBody: new ImportLookup(importRepos.decisionBody)
    }

    const writers = {
        journal: new JournalImportWriter(),
        organization: new OrganizationImportWriter(),
        awardScheme: new ImportWriter(importRepos.awardScheme),
        decisionBody: new DecisionBodyImportWriter(),
    };

    const options: ImportOptions = {
        validation: {
            allowUnknownFields: true,
        }
    };

    const relationResolver = new RelationResolver(lookups);
    const importJobRepo = new ImportJobRepository(prisma.importJob);

    const importService = new ImportService(
        importJobRepo,
        registry,
        writers,
        relationResolver,
        options
    );

    const schemaService = new ImportSchemaService(registry);

    const sourceDocumentRepository = new PrismaCrudRepository<
        SourceDocumentModel, 
        CreateSourceDocumentInput
    >(prisma.sourceDocument);
    const sourceDocumentService = new CrudService(sourceDocumentRepository);

    const controller = new ImportController(
        importService, 
        schemaService,
        sourceDocumentService,
    );

    return {
        controller,
        service: importService,
    }
};