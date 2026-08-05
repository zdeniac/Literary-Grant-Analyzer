import { ImportError } from "../error/import.errors";
import { ImportableEntityName } from "../constants/importable-models";
import { ImportWriterInterface } from "../types/import.types";
import { ImportRegistry } from "./import-registry";

export class ImportWriterRegistry extends ImportRegistry<ImportableEntityName, ImportWriterInterface<any>>
{
    getOrThrow(entity: ImportableEntityName): ImportWriterInterface<any>
    {
        const writer = this.get(entity);

        if (!writer) {
            throw new ImportError(
                `Missing import writer for ${entity}`
            );
        }

        return writer;
    }
}