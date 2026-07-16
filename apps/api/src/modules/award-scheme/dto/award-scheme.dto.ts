import { AwardSchemeType } from "@prisma/client";
import { Id, Name } from "../../../common/types/types";

export type AwardSchemeDto = {
    id: Id;
    name: Name;
    type: AwardSchemeType;
    organizationId: Id;

    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateAwardSchemeDto = {
    name: Name;
    type: AwardSchemeType;
    organizationId: Id;
};

export type UpdateAwardSchemeDto = Partial<CreateAwardSchemeDto>;