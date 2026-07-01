import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const modelName: string | undefined = process.argv[2];

if (!modelName) {
    console.error('Usage: npm run generate:crud <model-name>');
    process.exit(1);
}
// kebab-case name for the file names
const kebabCase = modelName.toLowerCase();
const basePath = path.join(
    process.cwd(),
    'src/modules',
    kebabCase
);

const green = "\x1b[32m";
const red = '\x1b[31m';
const resetColor = "\x1b[0m";

if (fs.existsSync(basePath)) {
    const rl = readline.createInterface({
        input,
        output,
    });

    const answer = await rl.question(
        `Module ${green}${modelName}${resetColor} already exists. ${red}Overwrite?${resetColor} (y/n): `
    );

    rl.close();

    if (answer.toLowerCase() !== 'y') {
        console.log('Cancelled.');
        process.exit(0);
    }
}

// PascalCase names for the class names
const pascalCase = modelName
    .split('-')
    .map(str => str ? str[0].toUpperCase() + str.slice(1) : '')
    .join('');

// camelCase names for the variables
const camelCase = pascalCase[0].toLowerCase() + pascalCase.slice(1);

const files = {
    [`dto/${kebabCase}.dto.ts`]: 'dto.tpl',
    [`mapper/${kebabCase}.mapper.ts`]: 'mapper.tpl',
    [`${kebabCase}.repository.ts`]: 'repository.tpl',
    [`${kebabCase}.service.ts`]: 'service.tpl',
    [`${kebabCase}.controller.ts`]: 'controller.tpl',
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

console.log(`${green}Created CRUD module: ${pascalCase}${resetColor}`);