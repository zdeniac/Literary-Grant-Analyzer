import { Journal } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { CreateJournalDto, UpdateJournalDto } from "./dto/journal.dto";

export class JournalRepository extends PrismaCrudRepository<Journal, CreateJournalDto, UpdateJournalDto> {
    constructor(model: PrismaModel<Journal>) {
        super(model);
    }
}