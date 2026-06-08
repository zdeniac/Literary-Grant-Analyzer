import { Request, Response, Router } from "express";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate";
import { organizationSchema } from "./validation/organization.schema";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { idSchema } from "../../common/validation/common.schema";

const router = Router();
const { service } = createOrganizationModule();

router.get(
    '/:id', 
    asyncHandler(async (req: Request, res: Response) => {
        const org = await service.findById(
            idSchema.parse(req.params.id)
        );
        res.json(toOrganizationDto(org));
    }),
);

router.put(
    '/:id',
    validate(organizationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const org = await service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        res.json(toOrganizationDto(org));
    }),
);

router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        await service.delete(idSchema.parse(req.params.id));
        res.sendStatus(204);
    }),
);

router.post(
    '/',
    validate(organizationSchema),
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