import { Journal } from "@prisma/client";
import { CreateJournalDto, UpdateJournalDto } from "./dto/journal.dto";
import { JournalRepository } from "./journal.repository";
import { CrudService } from "../../common/services/crud.service";

export class JournalService extends CrudService<Journal, CreateJournalDto, UpdateJournalDto> {
    constructor(
        repository: JournalRepository
    ) {
        super(repository);
    }
}