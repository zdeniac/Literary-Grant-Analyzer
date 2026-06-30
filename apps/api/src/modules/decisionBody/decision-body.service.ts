import { DecisionBody } from "@prisma/client";
import { CrudService, IdParam } from "../../common/types/types";
import { DecisionBodyRepository } from "./decision-body.repository";
import { CreateDecisionBodyDto, UpdateDecisionBodyDto } from "./dto/decision-body.dto";

export class DecisionBodyService implements CrudService<DecisionBody> {
    constructor(
        private repository: DecisionBodyRepository
    ) {}

    public async create(dto: CreateDecisionBodyDto): Promise<DecisionBody>
    {
        return this.repository.create(dto);
    }

    public async findById(id: IdParam): Promise<DecisionBody> 
    {
        return this.repository.findByIdOrThrow(id);
    }

    public async findAll(): Promise<DecisionBody[]>
    {
        return this.repository.findAll();
    }

    public async update(id: IdParam, dto: UpdateDecisionBodyDto): Promise<DecisionBody>
    {
        return this.repository.update(id, dto)
    }

    public async delete(id: IdParam): Promise<void>
    {
        return this.repository.delete(id)
    }
}