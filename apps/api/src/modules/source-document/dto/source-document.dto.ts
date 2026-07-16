import z from "zod";
import { Id } from "../../../common/types/types";
import { SourceDocumentSchema } from "../validation/source-document.schema";

export type SourceDocumentDto = {
    id: Id;
    
    title: string;
    url: string;
    retrievedAt: Date;

    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateSourceDocumentDto = z.infer<typeof SourceDocumentSchema>;

export type UpdateSourceDocumentDto = Partial<CreateSourceDocumentDto>;