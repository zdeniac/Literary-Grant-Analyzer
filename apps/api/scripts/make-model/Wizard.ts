import { ModelBuilder } from "./builders/ModelBuilder";
import { closeProcess } from "./cli/process";
import { ModelGenerator } from "./generator/ModelGenerator";

export class Wizard
{
    constructor(
        private readonly modelBuilder: ModelBuilder,
        private readonly modelGenerator: ModelGenerator,
    ) {}

    async run(): Promise<void>
    {
        const model = await this.modelBuilder.build();

        this.modelGenerator.generate(model);

        closeProcess(0);
    }
}