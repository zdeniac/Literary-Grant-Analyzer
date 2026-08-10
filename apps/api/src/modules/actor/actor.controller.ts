import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { ActorService } from "./actor.service";
import { toRecipientDto } from "./mapper/recipient.mapper";
import { toDecisionMakerDto } from "./mapper/decision-maker.mapper";

export class ActorController
{
    constructor(
        private readonly service: ActorService
    ) {
        this.findAllRecipients = this.findAllRecipients.bind(this);
        this.findAllDecisionMakers = this.findAllDecisionMakers.bind(this);
    }
    
    async findAllRecipients(req: Request, res: Response): Promise<void>
    {
        const recipients = await this.service.getRecipients();

        sendData(
            res, 
            recipients.map(toRecipientDto),
        );
    }

    async findAllDecisionMakers(req: Request, res: Response): Promise<void>
    {
        const decisionMakers = await this.service.getDecisionMakers();

        sendData(
            res,
            decisionMakers.map(toDecisionMakerDto),
        );
    }
}