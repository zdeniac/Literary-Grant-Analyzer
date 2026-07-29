import { EventHandlerInterface, EventInterface } from "./event.types";

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