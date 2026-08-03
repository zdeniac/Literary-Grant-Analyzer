import express from "express";
import organizationRouter from "./modules/organization/organization.routes";
import journalRouter from "./modules/journal/journal.routes";
import dataImportRouter from "./modules/data-import/import.routes";
import decisionAuthorityRouter from "./modules/decision-authority/decision-authority.routes";
import awardSchemeRouter from "./modules/award-scheme/award-scheme.routes";
import sourceDocumentRouter from "./modules/source-document/source-document.routes";
import awardDecisionRouter from "./modules/award-decision/award-decision.routes";
import importJobRouter from "./modules/data-import/import-job.routes";
import { errorHandler } from "./common/middleware/errorHandler";

const app = express();

const shouldLogRequests = process.env.LOG_REQUESTS === 'true' || process.env.NODE_ENV !== 'production';
if (shouldLogRequests) {
  app.use((req, res, next) => {
    console.log("HIT:", req.method, req.url);
    next();
  });
}

app.use(
  express.json(),
);

app.use('/api/organizations', organizationRouter);
app.use('/api/journals', journalRouter);
app.use('/api/import', dataImportRouter);
app.use('/api/decision-authorities', decisionAuthorityRouter);
app.use('/api/award-schemes', awardSchemeRouter);
app.use('/api/source-documents', sourceDocumentRouter);
app.use('/api/award-decisions', awardDecisionRouter);
app.use('/api/import-jobs', importJobRouter);

app.use(errorHandler);

export default app;