export enum JournalStatus {
    ACTIVE = 'ACTIVE',
    PAUSE = 'PAUSE',
    DECEASED = 'DECEASED',
}

export enum JournalFormat {
    ONLINE = 'ONLINE',
    PRINT = 'PRINT',
}

export enum LegalForm {
    // Korlátolt felelősségű társaság
    LTD = 'LTD',
    // Részvénytársaság
    PLC = 'PLC',
    // Alapítvány
    FOUNDATION = 'FOUNDATION',
    // Egyesület
    ASSOCIATION = 'ASSOCIATION',
    // Egyéb
    OTHER = 'OTHER',
}

export enum Sector {
    PUBLIC = 'PUBLIC',
    CIVIL = 'CIVIL',
    MARKET = 'MARKET',
    OTHER = 'OTHER',
}

export enum AwardSchemeType {
    GRANT = 'GRANT',
    SCHOLARSHIP = 'SCHOLARSHIP',
    AWARD = 'AWARD',
}