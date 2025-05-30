import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import http from "http";

import initializeSocket from "./lib/socket";

/* ROUTES */
import authRoute from "./routes/auth.route";
import usersRoute from "./routes/users.route";
import notificationsRoute from "./routes/notifications.route";
import searchRoute from "./routes/search.route";
import postsRoute from "./routes/posts.route";
import repliesRoute from "./routes/replies.route";
import likesRoute from "./routes/likes.route";
import conversationsRoute from "./routes/conversations.route";
import messagesRoute from "./routes/messages.route";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL!,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

app.use(cookieParser());

/* ROUTES */
app.get("/health", async (req: Request, res: Response) => {
  res.json({ message: "hello from server endpoint" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/search", searchRoute);
app.use("/api/posts", postsRoute);
app.use("/api/replies", repliesRoute);
app.use("/api/likes", likesRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);

const io = initializeSocket(server);

app.set("io", io);

server.listen(port, () => {
  console.log(`server running on ${port}`);
});
