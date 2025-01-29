import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import appconfig from "./config/appConfig.js";
import Authrouter from "./routes/authRoute.js";
import carbonFootPrintRouter from "./routes/carbonFootPrintRoute.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: appconfig.REACT_APP_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use("/api/v1/sustainify/auth", Authrouter);
app.use("/api/v1/sustainify/carbon", carbonFootPrintRouter);
