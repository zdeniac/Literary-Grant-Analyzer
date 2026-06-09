import express from "express";
import organizationRouter from "./modules/organization/organization.routes";

const app = express();

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});


app.use(
    express.json(),
);

app.use('/api/organizations', organizationRouter);


export default app;