"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const cronJob_1 = require("./lib/cronJob");
const socket_1 = __importDefault(require("./lib/socket"));
/* ROUTES */
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const notifications_route_1 = __importDefault(require("./routes/notifications.route"));
const search_route_1 = __importDefault(require("./routes/search.route"));
const posts_route_1 = __importDefault(require("./routes/posts.route"));
const replies_route_1 = __importDefault(require("./routes/replies.route"));
const likes_route_1 = __importDefault(require("./routes/likes.route"));
const conversations_route_1 = __importDefault(require("./routes/conversations.route"));
const messages_route_1 = __importDefault(require("./routes/messages.route"));
dotenv_1.default.config();
cronJob_1.cronJob.start();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(helmet_1.default.crossOriginResourcePolicy({
    policy: "cross-origin"
}));
app.use((0, cookie_parser_1.default)());
/* ROUTES */
app.get("/health", async (req, res) => {
    res.json({ message: "hello from server endpoint" });
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/users", users_route_1.default);
app.use("/api/notifications", notifications_route_1.default);
app.use("/api/search", search_route_1.default);
app.use("/api/posts", posts_route_1.default);
app.use("/api/replies", replies_route_1.default);
app.use("/api/likes", likes_route_1.default);
app.use("/api/conversations", conversations_route_1.default);
app.use("/api/messages", messages_route_1.default);
const io = (0, socket_1.default)(server);
app.set("io", io);
server.listen(port, () => {
    console.log(`server running on ${port}`);
});
