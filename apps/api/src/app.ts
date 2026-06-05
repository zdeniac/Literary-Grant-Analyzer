import express from "express";
import organizationRouter from "./modules/organization/organization.routes";

const app = express();

app.use(express.json());

app.use('/organizations', organizationRouter);

export default app;