import { ImportJobStatus } from "../../../../packages/shared/enums";

export const importJobStatuses = [
    { id: ImportJobStatus.RUNNING, name: 'Running'},
    { id: ImportJobStatus.COMPLETED, name: 'Completed' },
    { id: ImportJobStatus.FAILED, name: 'Failed' },
];