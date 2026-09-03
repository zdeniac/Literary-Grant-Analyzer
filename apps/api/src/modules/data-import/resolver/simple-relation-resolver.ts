import { ImportRelationError } from "../error/import.errors";
import { ImportLookupRegistry } from "../registry/import-lookup.registry";
import { ImportFileRowError } from "../types/error.types";
import { SimpleImportLookup, SimpleRelationImportBlueprint } from "../types/import-blueprint.types";
import { ImportLookupRegistryInterface } from "../types/import-lookup.types";
import { ImportRow } from "../types/import.types";
import { RelationResolverInterface } from "../types/service.types";

export class SimpleRelationResolver implements RelationResolverInterface<SimpleRelationImportBlueprint>
{
    constructor(
        private readonly lookupRegistry: ImportLookupRegistryInterface,
    ) {}

    public async resolve(rows: ImportRow[], relationBlueprint: SimpleRelationImportBlueprint): Promise<ImportRow[]>
    {
        const { lookup, entity, multiple = false } = relationBlueprint;
        const { sourceField, lookupField } = lookup;

        const entities = Array.isArray(entity)
            ? entity
            : [entity];

        const importLookup = this.lookupRegistry.getOrThrow(entities[0]);

        const normalize = (value: unknown) => importLookup.normalize(lookupField, value);

        const lookupValues = this.collectLookupValues(
            rows,
            sourceField,
            multiple,
            normalize
        );

        const foreignData = await this.fetchForeignData(
            entities,
            lookupField,
            lookupValues
        );

        const found = this.createLookupMap(
            foreignData,
            lookupField,
            normalize
        );

        this.assertRelationsResolved(
            rows,
            lookup,
            found,
            normalize,
            multiple
        );

        return this.transformRows(
            rows,
            relationBlueprint,
            found,
            normalize
        );
    }

    private async fetchForeignData(
        entities: string[], 
        lookupField: string,
        lookupValues: unknown[]
    ): Promise<Record<string, unknown>[]> {
        const foreignData: Record<string, unknown>[] = [];

        for (const entity of entities) {
            const data = await this.lookupRegistry
                .getOrThrow(entity)
                .findManyBy(lookupField, lookupValues);

            foreignData.push(...data);
        }

        return foreignData;
    }

    private collectLookupValues(
        rows: ImportRow[],
        sourceField: string,
        multiple: boolean,
        normalize: (value: unknown) => unknown,
    ): unknown[] {
        return multiple
            ? rows.flatMap(row =>
                (row[sourceField] as unknown[]).map(normalize)
            )
            : rows.map(row =>
                normalize(row[sourceField])
            );
    }

    private createLookupMap(
        foreignData: Record<string, unknown>[],
        lookupField: string,
        normalize: (value: unknown) => unknown,
    ): Map<unknown, Record<string, unknown>> {
        const found = new Map<unknown, Record<string, unknown>>();

        for (const item of foreignData) {
            found.set(
                normalize(item[lookupField]),
                item
            );
        }

        return found;
    }

    private assertRelationsResolved(
        rows: ImportRow[],
        lookup: SimpleImportLookup,
        found: Map<unknown, Record<string, unknown>>,
        normalize: (value: unknown) => unknown,
        multiple: boolean,
    ): void {
        const missing: ImportFileRowError[] = [];

        rows.forEach((row, rowIndex) => {
            const values = multiple
                ? (row[lookup.sourceField] as unknown[])
                : [row[lookup.sourceField]];

            const issues = values
                .filter(value => !found.has(normalize(value)))
                .map(value => ({
                    field: lookup.sourceField,
                    value,
                    message: `No ${lookup.sourceField} with value "${String(value)}" found in the database.`,
                }));

            if (issues.length) {
                missing.push({
                    rowNum: rowIndex + 2,
                    issues,
                });
            }
        });

        if (missing.length) {
            throw new ImportRelationError(missing);
        }
    }

    private transformRows(
        rows: ImportRow[],
        relation: SimpleRelationImportBlueprint,
        found: Map<unknown, Record<string, unknown>>,
        normalize: (value: unknown) => unknown,
    ): ImportRow[] {
        const {
            lookup: { sourceField },
            foreignKey,
            targetField,
            multiple,
        } = relation;

        return rows.map(row => {
            const transformedRow = { ...row };

            if (multiple) {
                transformedRow[foreignKey] = (row[sourceField] as unknown[])
                    .map(value => found.get(normalize(value))![targetField]);
            } else {
                transformedRow[foreignKey] =
                    found.get(normalize(row[sourceField]))![targetField];
            }

            delete transformedRow[sourceField];

            return transformedRow;
        });
    }
}
