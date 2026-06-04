import { Request, Response, Router } from "express";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";
import { NotFoundError } from "../../common/error/http.error";

const router: Router = Router();

const service = new OrganizationService();
const controller = new OrganizationController(service);

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const org = await controller.find(Number(req.params.id));
        res.json(org);
    } catch (e: any) {
        if (e instanceof NotFoundError) {
            res.sendStatus(e.statusCode);
        } else {
            res.sendStatus(500);
        }
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const org = await controller.update(
            Number(req.params.id), 
            req.body
        );
        res.json(org);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await controller.delete(Number(req.params.id));
        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const org = await controller.create(req.body);
        res.status(201).json(org);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/', async (req: Request, res: Response) => {
    const orgs = await controller.findAll();
    res.json(orgs);
});

export default router;