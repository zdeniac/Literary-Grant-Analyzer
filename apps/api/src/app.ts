import express from "express";
import organizationRouter from "./modules/organization/organization.routes";
import journalRouter from "./modules/journal/journal.routes";
import dataImportRouter from "./modules/data-import/import.routes";
import decisionBodyRouter from "./modules/decision-body/decision-body.routes";
import awardSchemeRouter from "./modules/award-scheme/award-scheme.routes";
import sourceDocumentRouter from "./modules/source-document/source-document.routes";

const app = express();

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

app.use(
    express.json(),
);

app.use('/api/organizations', organizationRouter);
app.use('/api/journals', journalRouter);
app.use('/api/import', dataImportRouter);
app.use('/api/decision-bodies', decisionBodyRouter);
app.use('/api/award-schemes', awardSchemeRouter);
app.use('/api/source-documents', sourceDocumentRouter);

export default app;