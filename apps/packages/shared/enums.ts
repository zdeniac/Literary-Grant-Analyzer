export enum JournalStatus {
    ACTIVE = 'ACTIVE',
    PAUSE = 'PAUSE',
    DECEASED = 'DECEASED',
    UNKNOWN = 'UNKNOWN',
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
    OTHER = 'OTHER',
}

export enum FundingArea {
    CREATIVE_WORK = 'CREATIVE_WORK',
    PERIODICAL = 'PERIODICAL',
    EVENT = 'EVENT',
    BOOK_PUBLISHING = 'BOOK_PUBLISHING',
    TRANSLATION = 'TRANSLATION',
    RESEARCH = 'RESEARCH',
    EDUCATION = 'EDUCATION',
    // Általános szakmai elismerés
    RECOGNITION = 'RECOGNITION',
    OTHER = 'OTHER',
}

export enum PersonRole {
    AUTHOR = 'AUTHOR',
    CRITIC = 'CRITIC',
    EDITOR = 'EDITOR',
    TRANSLATOR = 'TRANSLATOR',
    RESEARCHER = 'RESEARCHER',
    OTHER = 'OTHER',
}