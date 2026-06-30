import { Journal } from "@prisma/client";
import { CreateJournalDto, UpdateJournalDto } from "./dto/journal.dto";
import { CrudService, IdParam } from "../../common/types/types";
import { JournalRepository } from "./journal.repository";

export class JournalService implements CrudService<Journal> {
    constructor(
        private readonly repository: JournalRepository
    ) {}

    public async create(dto: CreateJournalDto): Promise<Journal>
    {
        return this.repository.create(dto);
    }

    public async findById(id: IdParam): Promise<Journal> 
    {
        return this.repository.findByIdOrThrow(id);
    }

    public async findAll(): Promise<Journal[]>
    {
        return this.repository.findAll();
    }

    public async update(id: IdParam, dto: UpdateJournalDto): Promise<Journal>
    {
        return this.repository.update(id, dto)
    }

    public async delete(id: IdParam): Promise<void>
    {
        return this.repository.delete(id)
    }
}