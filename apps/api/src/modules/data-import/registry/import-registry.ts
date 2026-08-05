export abstract class ImportRegistry<TKey, TValue>
{
    protected readonly items = new Map<TKey, TValue>();

    constructor(entries: [TKey, TValue][]) 
    {
        for (const [key, value] of entries) {
            this.items.set(key, value);
        }
    }

    get(key: TKey): TValue | undefined
    {
        return this.items.get(key);
    }

    has(key: TKey): boolean
    {
        return this.items.has(key);
    }

    getAll(): [TKey, TValue][]
    {
        return [...this.items.entries()];
    }
}