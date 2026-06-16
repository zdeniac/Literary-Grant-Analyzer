import { Request, Response, Router } from "express";
import { createJournalModule } from "./journal.factory";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { toJournalDto } from "./mapper/journal.mapper";
import { validate } from "../../common/middleware/validate";
import { JournalSchema } from "./validate/journal.schema";
import { idSchema } from "../../common/validation/common.schema";

const router = Router();
const { service } = createJournalModule();

router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const journal = await service.findById(
            idSchema.parse(req.params.id)
        );
        res.json({
            data: journal,
        });
    }),
);

router.put(
    '/:id',
    validate(JournalSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const org = await service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        res.json({ 
            data: toJournalDto(org)
        });
    }),
);

router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        await service.delete(idSchema.parse(req.params.id));
        res.sendStatus(204);
    }),
);

router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const journals = (await service.findAll())
            .map(toJournalDto);

        res.json({
            data: journals,
            total: journals.length
        });
    }),
);

router.post(
    '/',
    validate(JournalSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const journal = await service.create(req.body);
        res.json({
            data: toJournalDto(journal)
        });
    }),
);

export default router;
