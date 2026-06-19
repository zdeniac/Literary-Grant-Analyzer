import { describe, it } from "vitest";
import { OrganizationSchema } from "../../../src/modules/organization/validation/organization.schema";

describe('dataImporter', () => {

    it('works', () => {
        const file = {
            name: 'file.csv',
            extension: 'csv',
            header: [
                'name',
                'address',
                'legalForm',
                'foundingYear'
            ],
            rows: [
                {
                    name: 'Jelenkor Alapítvány',
                    address: 'Pécs',
                    legalForm: 'FOUNDATION',
                    foundingYear: 1990,
                },
            ],
        };

        // check if file extension is valid
        const validExtensions = ['csv'];

        let isValid: boolean = validExtensions.includes(file.extension);

        if (!isValid) throw new Error();

        // check if model name coming from the request is valid
        const validModels = ['organization', 'journal'];
        const requestModelName = 'organization';
        
        isValid = validModels.includes(requestModelName);

        if (!isValid) throw new Error();

        const modelBlueprints = [
            {
                name: 'organization',
                fields: Object.keys(
                    OrganizationSchema.shape
                ),
                schema: OrganizationSchema,
            }
        ];

        // get the blueprint for the model
        const model = modelBlueprints.filter((k) => k.name === requestModelName)[0] ?? null;

        if (!model) throw new Error();

        // check table headers are in accordance with mode blueprint
        const header = file.header;

        const invalidFields = model.fields.filter(
            field => !header.includes(field)
        );

        // pass the invalidfields
        if (invalidFields.length > 0) throw new Error();

        // extract data
        const rows = file.rows;

        // validate each row
        const validatedRows = [];
        for (const [index, row] of Object.entries(rows)) {
            const result = model.schema.safeParse(row);

            if (!result.success) {
            //index + 2, // fejléc miatt
            //result.error

                throw new Error();
            }   

            validatedRows.push(result);
        }

        // insert
        //prisma.model.createMany({
        // data: validatedRows
        //});
        // return validatedRows.length.
    });

});