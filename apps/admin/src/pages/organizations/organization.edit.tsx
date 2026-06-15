import { Edit, SelectInput, SimpleForm, TextInput } from "react-admin";
import { LegalForm } from "@prisma/client";
import { YearInput } from "../../components/inputs/YearInputs";

export const legalFormChoices = [
    { id: LegalForm.LTD, name: "Ltd." },
    { id: LegalForm.PLC, name: "PLC" },
    { id: LegalForm.FOUNDATION, name: "Foundation" },
    { id: LegalForm.ASSOCIATION, name: "Association" },
    { id: LegalForm.OTHER, name: "Other" },
];

export const OrganizationEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="address" />
            <SelectInput source="legalForm" choices={legalFormChoices}/>
            <YearInput source="foundingYear" />
        </SimpleForm>
    </Edit>
);