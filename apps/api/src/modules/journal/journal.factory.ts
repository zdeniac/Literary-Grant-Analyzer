import { prisma } from "../../db/prisma";
import { JournalController } from "./journal.controller";
import { JournalRepository } from "./journal.repository";
import { JournalService } from "./journal.service";
import { toJournalDto } from "./mapper/journal.mapper";

export const createJournalModule = () => {
    const service = new JournalService(new JournalRepository(prisma));
    const controller = new JournalController(service, toJournalDto);

    return {
        controller,
    }
};