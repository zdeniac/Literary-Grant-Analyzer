import { Create } from "react-admin";
import { OrganizationForm } from "./form/form";

export const OrganizationCreate = () => (
    <Create>
        <OrganizationForm />
    </Create>
);