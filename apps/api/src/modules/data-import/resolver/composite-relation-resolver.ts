import { EntityName } from "../../../common/types/types";
import { ImportRelationError } from "../error/import.errors";
import { ImportLookupRegistry } from "../registry/import-lookup.registry";
import { ImportFileRowError } from "../types/error.types";
import { CompositeImportLookup, CompositeRelationImportBlueprint } from "../types/import-blueprint.types";
import { ImportLookupInterface } from "../types/import-lookup.types";
import { ImportRow } from "../types/import.types";
import { RelationResolverInterface } from "../types/service.types";

/*
|--------------------------------------------------------------------------
| TODO - CompositeRelationResolver refactor
|--------------------------------------------------------------------------
|
| A jelenlegi implementáció működik, de több kompromisszumot tartalmaz.
|
| 1. Egységesíteni a SimpleRelationResolverrel 
|    - jelenleg a Simple és Composite resolver sok logikát duplikál
|      (lookup, validáció, transzformáció).
|    - a közös részeket érdemes egy közös absztrakcióba kiszervezni.
|
| 2. A lookup stratégiát külön objektummá/emelő osztállyá alakítani
|    - a resolveTargetRelation jelenleg egyszerre építi fel a keresési
|      stratégiát és hajtja végre a feloldást.
|    - célszerű lenne egy egységes "resolved lookup" modellt használni.
|
| 3. Normalizáció egységesítése
|    - jelenleg minden összehasonlításnál figyelni kell arra,
|      hogy melyik mezőhöz melyik ImportLookup tartozik.
|    - ezt a logikát a resolverből el kellene tüntetni.
|
| 4. foreignData indexelése
|    - jelenleg minden import sor végigiterál az összes foreignData elemen.
|    - nagy adatmennyiségnél ez O(n*m).
|    - érdemes lenne egy composite kulcs -> rekord Map-et építeni,
|      így a keresés O(1) lehetne.
|
| 5. Nested lookup kezelés egyszerűsítése
|    - jelenleg két lépcsőben történik:
|      import value
|            ↓
|      foreign entity
|            ↓
|      generated foreign key
|            ↓
|      composite relation
|    - hosszabb távon érdemes lenne ezt deklaratívabbá tenni.
|
| 6. Relation matching külön komponensbe
|    - a "criteria.every(...)" logika jelenleg a resolver része.
|    - ezt külön matcher/strategy objektumba lehetne kiszervezni.
|--------------------------------------------------------------------------
*/

export class CompositeRelationResolver implements RelationResolverInterface<CompositeRelationImportBlueprint>
{
    constructor(
        private readonly lookupRegistry: ImportLookupRegistry
    ) {}

    public async resolve(rows: ImportRow[], relationBlueprint: CompositeRelationImportBlueprint): Promise<ImportRow[]>
    {
        if (!rows.length) {
            return [];
        }

        const nestedLookups = relationBlueprint.lookup.filter(
            lookup => typeof lookup.foreignEntity !== 'undefined' && typeof lookup.foreignKey !== 'undefined'
        );

        let workingRows = rows.map(row => ({ ...row }));

        if (nestedLookups.length) {
            workingRows = await this.resolveNestedLookups(workingRows, nestedLookups);
        }

        return await this.resolveTargetRelation(workingRows, relationBlueprint);
    }

    private async resolveNestedLookups(rows: ImportRow[], lookups: CompositeImportLookup): Promise<ImportRow[]>
    {
        let workingRows = rows.map(row => ({ ...row }));

        for (const lookup of lookups) {
            const sourceField = lookup.sourceField;
            const lookupField = lookup.lookupField;
            const foreignKey = lookup.foreignKey!;
            const entity = lookup.foreignEntity!;

            const values = workingRows.map(row => row[sourceField]);

            const importLookup = this.lookupRegistry.getOrThrow(entity);
            const normalize = (value: unknown) => importLookup.normalize(lookupField, value);

            const foreignData =  await importLookup.findManyBy(lookupField, values);

            const found = new Map<unknown, Record<string, unknown>>();
            const duplicatedKeys = new Set<unknown>();
            
            for (const item of foreignData) {
                const key = normalize(item[lookupField]);

                if (found.has(key)) {
                    duplicatedKeys.add(key);
                } else {
                    found.set(key, item);
                }
            }

            if (duplicatedKeys.size > 0) {
                const issues: ImportFileRowError[] = [];

                workingRows.forEach((row, rowIndex) => {
                    const value = row[sourceField];

                    if (duplicatedKeys.has(normalize(value))) {
                        issues.push({
                            rowNum: rowIndex + 2,
                            issues: [{
                                field: sourceField,
                                value,
                                message: `Multiple ${entity} records found for ${sourceField}: ${String(value)}.`,
                            }],
                        });
                    }
                });

                if (issues.length) {
                    throw new ImportRelationError(issues);
                }
            }

            const missing: ImportFileRowError[] = [];

            workingRows.forEach((row, rowIndex) => {
                const value = row[sourceField];

                if (!found.has(normalize(value))) {
                    missing.push({
                        rowNum: rowIndex + 2,
                        issues: [{
                            field: sourceField,
                            value,
                            message: `No ${sourceField} with value "${String(value)}" found in the database.`,
                        }],
                    });
                }
            });

            if (missing.length) {
                throw new ImportRelationError(missing);
            }

            workingRows = workingRows.map(row => {
                const relatedRecord = found.get(normalize(row[sourceField]))!;
                return {
                    ...row,
                    [foreignKey]: relatedRecord.id,
                };
            });
        }

        return workingRows;
    }

    private async resolveTargetRelation(
        rows: ImportRow[], 
        relationBlueprint: CompositeRelationImportBlueprint,
    ): Promise<ImportRow[]> {
        const entity: EntityName = relationBlueprint.entity;

        const directLookups = relationBlueprint.lookup.filter(
            lookup => typeof lookup.foreignEntity === 'undefined'
        );

        const criteria = [
            ...directLookups.map(lookup => ({
                sourceField: lookup.sourceField,
                lookupField: lookup.lookupField,
                importLookup: this.lookupRegistry.getOrThrow(entity),
            })),
            ...relationBlueprint.lookup
                .filter(
                    lookup =>
                        lookup.foreignEntity !== undefined &&
                        lookup.foreignKey !== undefined
                )
                .map(lookup => ({
                    sourceField: lookup.foreignKey!,
                    lookupField: lookup.foreignKey!,
                    importLookup: this.lookupRegistry.getOrThrow(
                        lookup.foreignEntity!
                    ),
                })),
        ];

        if (!criteria.length) {
            throw new ImportRelationError([
                {
                    rowNum: 0,
                    issues: [{
                        message: 'Composite relation requires at least one lookup criterion.',
                    }],
                },
            ]);
        }

        const foreignData = await this.collectForeignData(entity, criteria, rows);
        return this.applyRelation(rows, relationBlueprint, foreignData, criteria);
    }

    private async collectForeignData(
        entity: EntityName, 
        lookupStrategy: Array<{
            sourceField: string;
            lookupField: string;
            importLookup: ImportLookupInterface<any>;
        }>, 
        rows: ImportRow[]
    ): Promise<Record<string, unknown>[]> {
        const foreignData: Record<string, unknown>[] = [];

        for (const criterion of lookupStrategy) {
            const values = rows.map(row => row[criterion.sourceField]);
            const data = 
                await this.lookupRegistry.getOrThrow(entity)
                                        .findManyBy(criterion.lookupField, values);
            
            foreignData.push(...data.map(item => ({ ...item })));
        }

        const unique = new Map<string, Record<string, unknown>>();

        for (const item of foreignData) {
            unique.set(JSON.stringify(item), item);
        }

        return Array.from(unique.values());
    }

    private applyRelation(
        rows: ImportRow[], 
        relationBlueprint: CompositeRelationImportBlueprint, 
        foreignData: Record<string, unknown>[],
        lookupStrategy: Array<{
            sourceField: string;
            lookupField: string;
            importLookup: ImportLookupInterface<any>;
        }>, 
    ): ImportRow[] {
        const missing: ImportFileRowError[] = [];

        const transformedRows = rows.map((row, rowIndex) => {
            const matches = foreignData.filter(item => {
                return lookupStrategy.every(({ sourceField, lookupField, importLookup }) => {
                    const dbValue = lookupField === sourceField
                        ? item[lookupField]
                        : importLookup.normalize(lookupField, item[lookupField]);

                    const importValue = lookupField === sourceField
                        ? row[sourceField]
                        : importLookup.normalize(lookupField, row[sourceField]);

                    return dbValue === importValue;
                })
            });

            if (matches.length !== 1) {
                missing.push({
                    rowNum: rowIndex + 2,
                    issues: [{
                        field: relationBlueprint.foreignKey,
                        value: lookupStrategy.map(({ sourceField }) => row[sourceField]),
                        message: matches.length === 0
                            ? `No ${Array.isArray(relationBlueprint.entity) 
                                ? relationBlueprint.entity.join(', ') 
                                : relationBlueprint.entity} record found for the composite lookup.`
                            : `Multiple ${Array.isArray(relationBlueprint.entity) 
                                ? relationBlueprint.entity.join(', ') 
                                : relationBlueprint.entity} records match the composite lookup.`,
                    }],
                });

                return { ...row };
            }

            const relatedRecord = matches[0];
            const transformedRow: ImportRow = {
                ...row,
                [relationBlueprint.foreignKey]: relatedRecord[relationBlueprint.targetField],
            };

            const cleanupFields = new Set<string>(relationBlueprint.lookup.map(lookup => lookup.sourceField));
            relationBlueprint.lookup
                .filter(
                    lookup => typeof lookup.foreignEntity !== 'undefined' 
                    && typeof lookup.foreignKey !== 'undefined'
                )
                .forEach(lookup => cleanupFields.add(lookup.foreignKey!));
            
            cleanupFields.delete(relationBlueprint.foreignKey);

            cleanupFields.forEach(field => {
                delete transformedRow[field];
            });

            return transformedRow;
        });

        if (missing.length) {
            throw new ImportRelationError(missing);
        }

        return transformedRows;
    }
}
