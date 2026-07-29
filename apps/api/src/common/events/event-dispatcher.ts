import { EventHandlerInterface, EventInterface } from "./types.event";

export class EventDispatcher
{
    constructor(
        private readonly handlers: EventHandlerInterface[],
    ) {}

    async dispatch(event: EventInterface): Promise<void>
    {
        for (const handler of this.handlers) {
            await handler.handle(event);
        }
    }
}