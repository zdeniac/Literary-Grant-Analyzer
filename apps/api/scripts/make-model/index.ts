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
1. enum builder
2. meglévő model edit
3. delete/overwrite kezelés
4. migration futtatás opcionálisan
5. tesztek 
*/

const config = new PrismaConfig(prismaConfig);
const schema = new PrismaSchema(config);

const modelGenerator = new ModelGenerator(new FieldGenerator(), config.getModelsPath());

const relationBuilder = new RelationBuilder(schema);
const modelBuilder = new ModelBuilder(relationBuilder);

const wizard = new Wizard(modelBuilder, modelGenerator);

wizard.run();





// then ask him whether we should ran the prisma:migration and generate commands

// we ran them or exit
