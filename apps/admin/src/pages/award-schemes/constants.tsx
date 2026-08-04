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
        name: 'Folyóiratok és periodikus kiadványok',
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
        name: 'Műfordítás és fordítói tevékenység',
    },
    {
        id: FundingArea.RESEARCH,
        name: 'Kutatás, kritika és irodalomtudomány',
    },
    {
        id: FundingArea.EDUCATION,
        name: 'Oktatás és ismeretterjesztés',
    },
    {
        id: FundingArea.RECOGNITION,
        name: 'Díjak és szakmai elismerések',
    },
    {
        id: FundingArea.OTHER,
        name: 'Egyéb',
    },
];