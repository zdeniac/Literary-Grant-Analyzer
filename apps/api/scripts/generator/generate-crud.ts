import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const modelName: string | undefined = process.argv[2];

if (!modelName) {
    console.error('Usage: npm run generate:crud <model-name>');
    process.exit(1);
}
// kebab-case name for the filenames
const kebabCase = modelName.toLowerCase();

const basePath = path.join(
    process.cwd(),
    'src/modules',
    kebabCase
);

const green = '\x1b[32m';
const greenBg = '\x1b[42m';
const redBg = '\x1b[41m';
const resetColor = '\x1b[0m';
const yellow = '\x1b[33m';

if (fs.existsSync(basePath)) {
    const rl = readline.createInterface({
        input,
        output,
    });

    const answer = await rl.question(
        `Module ${greenBg}${modelName}${resetColor} already exists. ${redBg}Overwrite?${resetColor} ${yellow}(y/n)${resetColor}: `
    );

    rl.close();

    if (answer.toLowerCase() !== 'y') {
        console.log(`${yellow}Cancelled.${resetColor}`);
        process.exit(0);
    }
}

// PascalCase for the classnames
const pascalCase = modelName
    .split('-')
    .map(str => str ? str[0].toUpperCase() + str.slice(1) : '')
    .join('');

// camelCase for the variables
const camelCase = pascalCase[0].toLowerCase() + pascalCase.slice(1);

const files = {
    [`dto/${kebabCase}.dto.ts`]: 'dto.tpl',
    [`mapper/${kebabCase}.mapper.ts`]: 'mapper.tpl',
    [`validate/${kebabCase}.schema.ts`]: 'schema.tpl',
    [`${kebabCase}.repository.ts`]: 'repository.tpl',
    [`${kebabCase}.service.ts`]: 'service.tpl',
    [`${kebabCase}.controller.ts`]: 'controller.tpl',
    [`${kebabCase}.routes.ts`]: 'routes.tpl',
    [`${kebabCase}.factory.ts`]: 'factory.tpl',
};

for (const [file, content] of Object.entries(files)) {
    const target = path.join(basePath, file);

    let templateContent = fs.readFileSync(
        new URL(`./templates/${content}.ts`, import.meta.url),
        'utf8'
    );

    templateContent = templateContent
        .replaceAll('{{ pascalCase }}', pascalCase)
        .replaceAll('{{ camelCase }}', camelCase)
        .replaceAll('{{ kebabCase }}', kebabCase);

    fs.mkdirSync(
        path.dirname(target),
        { recursive:true }
    );

    fs.writeFileSync(
        target,
        templateContent.trim()
    );
}

console.log(`${green}Created CRUD module: ${pascalCase}${resetColor} \n${yellow}Now add the routes to the application, and you are done!${resetColor}`);