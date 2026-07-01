import { Journal } from "@prisma/client";
import { CrudController } from "../../common/contollers/crud.controller";
import { JournalService } from "./journal.service";
import { JournalDto } from "./dto/journal.dto";
import { Mapper } from "../../common/types/types";

export class JournalController extends CrudController<Journal, JournalDto> {
    constructor(
        service: JournalService,
        mapper: Mapper<Journal, JournalDto>
    ) {
        super(service, mapper);
    }
}