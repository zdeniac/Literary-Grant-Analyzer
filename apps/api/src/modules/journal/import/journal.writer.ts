import { repositoryContainer } from "../../../db/repositories/container";
import { transaction } from "../../../db/transaction";
import { ImportWriterInterface } from "../../data-import/types/import.types";
import { ImportJournalWithOrganizationIdsInput } from "../dto/journal.input.dto";

export class JournalImportWriter implements ImportWriterInterface<ImportJournalWithOrganizationIdsInput>
{
    createMany(data: ImportJournalWithOrganizationIdsInput[]): Promise<number>
    {
        return transaction(async (tx) => {
            const repositories = repositoryContainer(tx);

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

                await journalAffiliationRepository.createMany(
                    journal.organizationIds.map(organizationId => ({
                        journalId: journo.id,
                        organizationId,
                    }))
                );            
            }
            
            return data.length;
        });
    }
}