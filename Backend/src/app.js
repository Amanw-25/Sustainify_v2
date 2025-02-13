import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import appconfig from "./config/appConfig.js";
import Authrouter from "./routes/authRoute.js";
import UserRouter from "./routes/UserRoute.js";
import carbonFootPrintRouter from "./routes/carbonFootPrintRoute.js";
import productRouter from "./routes/ProductRoute.js";
import twilioRouter from "./routes/twilioRoute.js";
import BlogRouter from "./routes/BlogRoute.js";
import EventRoute from "./routes/EventRoute.js";
import MeetingRoute from "./routes/MeetingRoute.js";
import socketHandler from "./socket.js";
import CheckoutRouter from "./routes/checkoutRoute.js";
import CartRouter from "./routes/CartRoute.js";
import Subscription from "./routes/SubscriptionRoute.js";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: appconfig.REACT_APP_BASE_URL,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: appconfig.REACT_APP_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);


// Routes
app.use("/api/v1/sustainify/auth", Authrouter);
app.use("/api/v1/sustainify/user", UserRouter);
app.use("/api/v1/sustainify/carbon", carbonFootPrintRouter);
app.use("/api/v1/sustainify/product", productRouter);
app.use("/api/v1/sustainify/twilio", twilioRouter);
app.use("/api/v1/sustainify/blog", BlogRouter);
app.use("/api/v1/sustainify/event", EventRoute);
app.use("/api/v1/sustainify/meeting", MeetingRoute);
app.use("/api/v1/sustainify/checkout", CheckoutRouter);
app.use("/api/v1/sustainify/cart", CartRouter);
app.use("/api/v1/sustainify/subscription", Subscription);


// Socket.io Connection
io.on('connection', (socket) => socketHandler(socket, io));