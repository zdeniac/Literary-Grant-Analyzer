import express from "express";
import organizationRouter from "./modules/organization/organization.routes";
import journalRouter from "./modules/journal/journal.routes";
import dataImportRouter from "./modules/dataImport/import.routes";
import decisionBodyRouter from "./modules/decisionBody/decision-body.routes";

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

export default app;