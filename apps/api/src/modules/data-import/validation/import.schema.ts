import z from "zod";
import { FileDelimiter } from "../../../../../packages/shared/enums";

export const importFileDelimiterSchema = z.enum(FileDelimiter);