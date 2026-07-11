import { prismaTypes, referenceActions, relationTypes } from "./constants";

export type PrismaType = typeof prismaTypes[keyof typeof prismaTypes];

export type RelationType = typeof relationTypes[keyof typeof relationTypes];

export type ReferentialAction = typeof referenceActions[keyof typeof referenceActions];

export type ScalarForeignKeyType = Extract<PrismaType, 'int' | 'bigint' | 'string'>;

export type ParsedSchema = Map<string, Record<string, unknown>>;

export type PropertyInput = {
    type: PrismaType;
    optional: boolean;
    unique: boolean;
    default?: string;
};

export type BaseRelationInput = {
    model: string;
    property: string;
};

export type ReferenceField = {
    name: string;
    type: ScalarForeignKeyType;
};

export type OneToManyRelationInput = BaseRelationInput;
export type ManyToOneRelationInput = BaseRelationInput & {
    foreignKey: string;

    reference: ReferenceField;

    referentialActions: {
        onDelete: ReferentialAction;
        onUpdate: ReferentialAction;
    };
};

export type RelationInput = ManyToOneRelationInput | OneToManyRelationInput;

export type ModelInput = {
    name: string;
    props: Map<string, PropertyInput>;
    hasAuditFields: boolean;
    relations: RelationInput[];
};

export type GeneratedField = {
    name: string;
    type: string;
    attributes?: string;
};
