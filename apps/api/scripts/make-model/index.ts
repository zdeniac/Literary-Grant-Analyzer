import prismaConfig from "../../prisma.config";
import { ModelBuilder } from "./builders/ModelBuilder";
import { RelationBuilder } from "./builders/RelationBuilder";
import { PrismaConfig } from "./config/PrismaConfig";
import { FieldGenerator } from "./generator/FieldGenerator";
import { ModelGenerator } from "./generator/ModelGenerator";
import { PrismaSchema } from "./schema/PrismaSchema";
import { Wizard } from "./Wizard";

/**
 * @todo:
 * - 4. tesztek!
 * - 5. enum handling
 */

const config = new PrismaConfig(prismaConfig);
const schema = new PrismaSchema(config);

const modelGenerator = new ModelGenerator(new FieldGenerator());

const relationBuilder = new RelationBuilder(schema);
const modelBuilder = new ModelBuilder(relationBuilder);

const wizard = new Wizard(modelBuilder, modelGenerator);

wizard.run();












// X we save it to a variable and open then next prompt window and save it into the object's param's variable

// X we open the terminal for that param's type

// X repeat

// X if the user finishes the process we generate the model's structure to the folder structure

// then ask him whether we should ran the prisma:migration and generate commands

// we ran them or exit
