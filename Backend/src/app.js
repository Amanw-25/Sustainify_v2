import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import appconfig from "./config/appConfig.js";
import Authrouter from "./routes/authRoute.js";
import carbonFootPrintRouter from "./routes/carbonFootPrintRoute.js";
import productRouter from "./routes/ProductRoute.js";
import twilioRouter from "./routes/twilioRoute.js";
import BlogRouter from "./routes/BlogRoute.js";

export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use(express.json());
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
app.use("/api/v1/sustainify/product", productRouter);
app.use("/api/v1/sustainify/twilio", twilioRouter);
app.use("/api/v1/sustainify/blog", BlogRouter);

