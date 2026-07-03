import { JournalStatus } from "../../../../packages/shared/enums";

export const journalStatuses = [
    { id: JournalStatus.ACTIVE, name: 'Aktív' },
    { id: JournalStatus.PAUSE, name: 'Felfüggesztve' },
    { id: JournalStatus.CLOSED, name: 'Megszűnt' },
];
