import { AwardScheme } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { CreateAwardSchemeDto, UpdateAwardSchemeDto } from "./dto/award-scheme.dto";

export class AwardSchemeRepository 
extends PrismaCrudRepository<AwardScheme, CreateAwardSchemeDto, UpdateAwardSchemeDto> 
{
    protected get model(): PrismaModel<AwardScheme>
    {
        return this.db.awardScheme;
    }
}