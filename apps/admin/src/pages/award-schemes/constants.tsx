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
        id: FundingArea.PERIODICAL,
        name: 'Folyóiratok és periodikák, online és print',
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