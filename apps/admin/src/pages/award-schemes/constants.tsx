import { AwardSchemeType } from "../../../../packages/shared/enums";
import { FundingArea } from "../../../../packages/shared/enums";

export const awardSchemeTypes = [
    { 
        id: AwardSchemeType.AWARD, 
        name: 'Díj',
    },
    { 
        id: AwardSchemeType.GRANT, 
        name: 'Támogatás',
    },
    { 
        id: AwardSchemeType.SCHOLARSHIP, 
        name: 'Ösztöndíj',
    },
    {
        id: AwardSchemeType.OTHER,
        name: 'Egyéb',
    }
];

export const fundingAreas = [
    {
        id: FundingArea.CREATIVE_WORK,
        name: 'Alkotói tevékenység',
    },
    {
        id: FundingArea.ONLINE_PERIODICAL,
        name: 'Online folyóiratok',
    },
    {
        id: FundingArea.PRINT_PERIODICAL,
        name: 'Print folyóiratok',
    },
    {
        id: FundingArea.ONLINE_PRESENCE,
        name: 'Online tevékenység (pl. honlapfejlesztés)',
    },
    {
        id: FundingArea.EVENT,
        name: 'Irodalmi és kulturális rendezvények',
    },
    {
        id: FundingArea.BOOK_PUBLISHING,
        name: 'Könyvkiadás és könyvszakmai tevékenység',
    },
    {
        id: FundingArea.TRANSLATION,
        name: 'Fordítás',
    },
    {
        id: FundingArea.RESEARCH,
        name: 'Kutatás, irodalomtudomány',
    },
    {
        id: FundingArea.EDUCATION,
        name: 'Oktatás és ismeretterjesztés',
    },
    {
        id: FundingArea.RECOGNITION,
        name: 'Általános szakmai elismerés',
    },
    {
        id: FundingArea.OTHER,
        name: 'Egyéb',
    },
];