import { Request, Response, Router } from "express";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate";
import { createOrganizationSchema } from "./validation/organization.schema";
import { toOrganizationDto } from "./mapper/organization.mapper";

const router = Router();
const { service } = createOrganizationModule();

router.get(
    '/:id', 
    asyncHandler(async (req: Request, res: Response) => {
        const org = await service.findById(Number(req.params.id));
        res.json(toOrganizationDto(org));
    }),
);

router.put(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const org = await service.update(
            Number(req.params.id), 
            req.body
        );
        res.json(toOrganizationDto(org));
    }),
);

router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        await service.delete(Number(req.params.id));
    }),
);

router.post(
    '/',
    validate(createOrganizationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const org = await service.create(req.body);
        res.json(toOrganizationDto(org));
    }),
);

router.get(
    '/',
    asyncHandler (async (req: Request, res: Response) => {
        const orgs = (await service.findAll())
            .map(toOrganizationDto);
        res.json(orgs);
    }),
);

export default router;