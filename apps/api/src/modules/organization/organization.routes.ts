import { Request, Response, Router } from "express";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";
import { asyncHandler } from "../../common/middleware/asyncHandler";

const router: Router = Router();

const service = new OrganizationService();
const controller = new OrganizationController(service);

router.get(
    '/:id', 
    asyncHandler(async (req: Request, res: Response) => {
        const org = await controller.find(Number(req.params.id));
        res.json(org);
    }),
);

router.put(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const org = await controller.update(
            Number(req.params.id), 
            req.body
        );
        res.json(org);
    }),
);

router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        await controller.delete(Number(req.params.id));
    }),
);

router.post(
    '/', 
    asyncHandler(async (req: Request, res: Response) => {
        const org = await controller.create(req.body);
        res.json(org);
    }),
);

router.get(
    '/',
    asyncHandler (async (req: Request, res: Response) => {
        const orgs = await controller.findAll();
        res.json(orgs);
    }),
);

export default router;