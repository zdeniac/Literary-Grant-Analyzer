import { createRepositories } from "../../../db/repositories/factory";
import { transaction } from "../../../db/transaction";
import { ImportWriterInterface } from "../../data-import/types/import.types";
import { ImportJournalWithOrganizationIdInput } from "../dto/journal.input.dto";

export class JournalImportWriter implements ImportWriterInterface<ImportJournalWithOrganizationIdInput>
{
    createMany(data: ImportJournalWithOrganizationIdInput[]): Promise<number>
    {
        return transaction(async (tx) => {
            const repositories = createRepositories(tx);

            const journalRepository = repositories.journal;
            const journalAffiliationRepository = repositories.journalAffiliation;

            for (const journal of data) {
                const journo = await journalRepository.create({
                    name: journal.name,
                    status: journal.status,
                    issn: journal.issn,
                    format: journal.format,
                    foundingYear: journal.foundingYear
                });

                await journalAffiliationRepository.create({
                    journalId: journo.id,
                    organizationId: journal.organizationId,
                });
            }
            
            return data.length;
        });
    }
}