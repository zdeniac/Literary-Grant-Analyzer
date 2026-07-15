import { Journal } from "@prisma/client";
import { CrudController } from "../../common/controllers/crud.controller";
import { JournalService } from "./journal.service";
import { JournalDto } from "./dto/journal.dto";
import { DtoMapper } from "../../common/types/types";

export class JournalController extends CrudController<Journal, JournalDto> {
    constructor(
        service: JournalService,
        mapper: DtoMapper<Journal, JournalDto>
    ) {
        super(service, mapper);
    }
}