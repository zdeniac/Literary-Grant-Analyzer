export interface EventInterface {}

export interface EventHandlerInterface
{
    handle(event: EventInterface): Promise<void>;
}