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
        // Alkotói tevékenység, szépirodalmi művek és egyéb művészeti alkotások létrehozása
    CREATIVE_WORK = 'CREATIVE_WORK',

    // Folyóiratok, lapok és egyéb periodikus kiadványok megjelentetése
    PERIODICAL = 'PERIODICAL',

    // Irodalmi és kulturális rendezvények, rendezvénysorozatok megvalósítása
    EVENT = 'EVENT',

    // Könyvkiadás, könyvkiadói programok és könyvszakmai tevékenységek támogatása
    BOOK_PUBLISHING = 'BOOK_PUBLISHING',

    // Műfordítási és fordítói alkotótevékenység támogatása
    TRANSLATION = 'TRANSLATION',

    // Irodalomtudományi, kritikai, kutatási és elemző tevékenységek támogatása
    RESEARCH = 'RESEARCH',

    // Oktatási, ismeretterjesztő és kulturális nevelési programok támogatása
    EDUCATION = 'EDUCATION',

    // Díjak, kitüntetések és egyéb szakmai elismerések
    RECOGNITION = 'RECOGNITION',

    OTHER = 'OTHER',
}