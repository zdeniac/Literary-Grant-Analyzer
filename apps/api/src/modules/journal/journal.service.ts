import { prisma } from "../../db/prisma";
import { Journal } from "@prisma/client";
import { CreateJournalDto, UpdateJournalDto } from "./dto/journal.dto";
import { IdParam } from "../../common/validation/common.schema";
import { findOrThrow } from "../../db/helpers";

export class JournalService {
    public async create(dto: CreateJournalDto): Promise<Journal>
    {
        return await prisma.journal.create({ 
            data: dto 
        });
    }

    public async findById(id: IdParam): Promise<Journal>
    {
        return findOrThrow(
            prisma.journal.findFirst({
                where: {
                    id,
                },
            })
        );
    }

    public async findAll(): Promise<Journal[]>
    {
        return await prisma.journal.findMany();
    }
    
    public async update(id: IdParam, dto: UpdateJournalDto): Promise<Journal>
    {
        return findOrThrow(
            prisma.journal.update({
                where: {
                    id,
                },
                data: dto
            })
        );
    }

    public async delete(id: IdParam): Promise<Journal>
    {
        return findOrThrow(
            prisma.journal.delete({
                where: {
                    id,
                }
            })
        );
    }
}