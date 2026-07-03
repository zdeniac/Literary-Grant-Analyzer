import { LegalForm } from "../../../../packages/shared/enums";

export const legalForms =[
    { 
        id: LegalForm.LTD, 
        name: 'Korlátolt felelősségű társaság (Kft.)' 
    },
    { 
        id: LegalForm.PLC, 
        name: 'Nyilvánosan Működő Részvénytársaság (Nyrt.)' 
    },
    { 
        id: LegalForm.FOUNDATION, 
        name: 'Alapítvány' 
    },
    { 
        id: LegalForm.ASSOCIATION, 
        name: 'Egyesület' 
    },
    {
        id: LegalForm.OTHER, 
        name: 'Egyéb' 
    },
];
