import { awardDecisionBlueprint } from "../../award-decision/import/award-decision.blueprint";
import { awardSchemeBlueprint } from "../../award-scheme/import/award-scheme.blueprint";
import { decisionAuthorityBlueprint } from "../../decision-authority/import/decision-authority.blueprint";
import { journalBlueprint } from "../../journal/import/journal.blueprint";
import { organizationBlueprint } from "../../organization/import/organization.blueprint";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";

export const createImportBlueprintRegistry = () => (
    new ImportBlueprintRegistry(
        journalBlueprint, 
        organizationBlueprint,
        awardSchemeBlueprint,
        decisionAuthorityBlueprint,
        awardDecisionBlueprint,
    )   
);