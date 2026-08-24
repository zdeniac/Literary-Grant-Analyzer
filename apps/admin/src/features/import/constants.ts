import { FileDelimiter } from "../../../../packages/shared/enums";

export const validFileDelimiters = [
    {
        id: FileDelimiter.COMMA,
        name: 'Vessző (,)',
    },
    {
        id: FileDelimiter.SEMICOLON,
        name: 'Pontosvessző (;)',
    },
    {
        id: FileDelimiter.TAB,
        name: 'Tabulátor',
    },
    {
        id: FileDelimiter.SPACE,
        name: 'Szóköz',
    },
    {
        id: FileDelimiter.SINGLE_QUOTE,
        name: "Idézőjel (')",
    },
];