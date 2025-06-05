import express, { json } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import router from "./routers/index.routers";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

export { app };
