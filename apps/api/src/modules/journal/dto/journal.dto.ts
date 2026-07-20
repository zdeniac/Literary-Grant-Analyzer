import { JournalFormat, JournalStatus } from "@prisma/client"
import z from "zod";
import { CreateJournalSchemaWithOrganizations, UpdateJournalSchemaWithOrganizations } from "../validate/journal.schema";
import { Issn } from "../types/journal.types";
import { Id, Name, Year } from "../../../common/types/types";
import { JournalOrganizationDto } from "../../journal-organization/dto/journal-organization.dto";

export type JournalWithOrganizationsDto = {
    id: Id;
    
    name: Name;
	issn: Issn | null;
	status: JournalStatus;
    format: JournalFormat[];
    foundingYear: Year | null;

    organizations: JournalOrganizationDto[];

    createdAt: Date;
    updatedAt: Date | null;
}

export type JournalDto = {
    id: Id;
    
    name: Name;
	issn: Issn | null;
	status: JournalStatus;
    format: JournalFormat[];
    foundingYear: Year | null;

    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateJournalWithOrganizationsInput = z.infer<typeof CreateJournalSchemaWithOrganizations>;
export type UpdateJournalWithOrganizationsInput = z.infer<typeof UpdateJournalSchemaWithOrganizations>;