import { JournalService } from "./journal.service";

export const createJournalModule = () => {
    return {
        service: new JournalService(),
    }
};