import { Create } from "react-admin";
import { JournalForm } from "./form/form";

export const JournalCreate = () => (
    <Create>
        <JournalForm />
    </Create>
);