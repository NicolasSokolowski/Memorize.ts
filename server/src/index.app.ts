import express, { json } from "express";
import router from "./routers/index.routers";

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

export { app };
