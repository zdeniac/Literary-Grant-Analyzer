import { JournalService } from "./journal.service";

export const createJournalModule = () => ({
    service: new JournalService(),
});