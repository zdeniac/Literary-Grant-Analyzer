import { prisma } from "../../db/prisma";
import { Journal } from "@prisma/client";
import { CreateJournalDto, UpdateJournalDto } from "./dto/journal.dto";
import { IdParam } from "../../common/validation/common.schema";
import { findOrThrow } from "../../db/helpers";

export class JournalService {
    async create(dto: CreateJournalDto): Promise<Journal> {
        return await prisma.journal.create({ 
            data: dto 
        });
    }

    async findById(id: IdParam): Promise<Journal> {
        return findOrThrow(
            prisma.journal.findUnique({
                where: {
                    id,
                },
            })
        );
    }

    async findAll(): Promise<Journal[]> {
        return await prisma.journal.findMany();
    }
    

    async update(id: IdParam, dto: UpdateJournalDto): Promise<Journal> {
        return findOrThrow(
            prisma.journal.update({
                where: {
                    id,
                },
                data: dto
            })
        );
    }

    async delete(id: IdParam): Promise<Journal> {
        return findOrThrow(
            prisma.journal.delete({
                where: {
                    id,
                }
            })
        );
    }
}