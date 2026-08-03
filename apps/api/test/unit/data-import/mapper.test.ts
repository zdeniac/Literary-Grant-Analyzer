import { describe, expect, it } from "vitest";
import { toImportFile } from "../../../src/modules/data-import/mapper/import.mapper";

describe('toImportFile', () => {
    it('converts uploaded csv file to ImportFile', () => {
        const csv = `
name,address,year
Jelenkor,Pécs,1990
Alföld,Szeged,1989
`;
        const file = {
            originalname: 'organizations.csv',
            mimetype: 'text/csv',
            buffer: Buffer.from(csv),
        } as Express.Multer.File;

        const result = toImportFile(file);

        expect(result).toMatchObject({
            fileName: 'organizations.csv',
            mimeType: 'text/csv',
            header: [
                'name',
                'address',
                'year',
            ],
        });

        expect(result.rows).toHaveLength(2);

        expect(result.rows[0]).toMatchObject({
            name: 'Jelenkor',
            address: 'Pécs',
            year: '1990',
        });

        expect(result.rows[1]).toMatchObject({
            name: 'Alföld',
            address: 'Szeged',
            year: '1989',
        });
    });
});