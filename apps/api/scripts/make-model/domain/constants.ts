export const relationTypes = {
    oneToMany: '1:N',
    manyToOne: 'N:1',
} as const;

export const referenceActions = {
    cascade: 'Cascade',
    restrict: 'Restrict',
    noAction: 'NoAction',
    setNull: 'SetNull',
    setDefault: 'SetDefault',
} as const;

export const prismaTypes = {
    string: 'String',
    boolean: 'Boolean',
    int: 'Int',
    bigint: 'BigInt',
    float: 'Float',
    decimal: 'Decimal',
    datetime: 'DateTime',
    bytes: 'Bytes',
    json: 'Json',
    relation: 'Relation',
    enum: 'Enum',
} as const;

