import { Router } from "express";
import { createActorModule } from "./actor.factory";

const router = Router();
const { controller } = createActorModule();

const findAllDecisionMakers = router.get('/', controller.findAllDecisionMakers);
const findAllRecipients = router.get('/', controller.findAllRecipients);

export {
    findAllDecisionMakers,
    findAllRecipients,
}