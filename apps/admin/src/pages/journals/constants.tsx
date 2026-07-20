import { JournalFormat, JournalStatus } from "../../../../packages/shared/enums";

export const journalStatuses = [
    { id: JournalStatus.ACTIVE, name: 'Aktív' },
    { id: JournalStatus.PAUSE, name: 'Felfüggesztve' },
    { id: JournalStatus.DECEASED, name: 'Megszűnt' },
];

export const journalFormats = [
    { id: JournalFormat.ONLINE, name: 'Online' },
    { id: JournalFormat.PRINT, name: 'Nyomtatott' },
];