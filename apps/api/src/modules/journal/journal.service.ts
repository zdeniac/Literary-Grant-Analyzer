import { prisma } from "../../db/prisma";
import { Journal } from "@prisma/client";
import { CreateJournalDto, UpdateJournalDto } from "./dto/journal.dto";
import { IdParam } from "../../common/validation/common.schema";
import { NotFoundError } from "../../common/error/http.error";

export class JournalService {
    async create(dto: CreateJournalDto): Promise<Journal> {
        return await prisma.journal.create({ 
            data: dto 
        });
    }

    async findById(id: IdParam): Promise<Journal> {
        const journal: Journal | null = await prisma.journal.findUnique({
            where: {
                id,
            },
        });

        if (!journal) throw new NotFoundError();

        return journal;
    }

    async findAll(): Promise<Journal[]> {
        return await prisma.journal.findMany();
    }
    

    async update(id: IdParam, dto: UpdateJournalDto): Promise<Journal> {
        return await prisma.journal.update({
            where: {
                id,
            },
            data: dto
        });
    }

    async delete(id: IdParam): Promise<Journal> {
        return await prisma.journal.delete({
            where: {
                id,
            }
        });
    }
    
}