import { createRepositories } from "../../../db/repositories/factory";
import { transaction } from "../../../db/transaction";
import { ImportWriterInterface } from "../../data-import/types/import.types";
import { CreateJournalWithOrganizationIdInput } from "../dto/journal.input.dto";

export class JournalImportWriter implements ImportWriterInterface<CreateJournalWithOrganizationIdInput>
{
    createMany(data: CreateJournalWithOrganizationIdInput[]): Promise<number>
    {
        return transaction(async (tx) => {
            const repositories = createRepositories(tx);

            const journalRepository = repositories.journal;
            const journAffiliationRepository = repositories.journalAffiliation;

            for (const journal of data) {
                const journo = await journalRepository.create(journal);
                await journAffiliationRepository.create({
                    journalId: journo.id,
                    organizationId: journal.organizationId,
                });
            }
            
            return data.length;
        });
    }
}