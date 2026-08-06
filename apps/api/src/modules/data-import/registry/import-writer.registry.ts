import { ImportError } from "../error/import.errors";
import { ImportableEntityName } from "../constants/importable-models";
import { ImportRegistry } from "./import-registry";
import { ImportWriterInterface } from "../types/service.types";

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