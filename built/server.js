"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const routes = require("../routes");
const express_session_1 = __importDefault(require("express-session"));
const port = process.env.PORT || 4000;
const app = express_1.default();
let origin = '';
if (process.env.NODE_ENV === "production") {
    origin = "https://fishily.netlify.app";
}
else {
    origin = "http://localhost:3000";
}
const corsOptions = {
    origin: origin,
};
app.use(express_1.default.json());
app.use(cors_1.default(corsOptions));
app.use(express_session_1.default({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
    },
}));
app.use("/api/fishily/users", routes.users);
app.use("/api/fishily/posts", routes.posts);
app.use("/api/fishily/comments", routes.comments);
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("fishily-client/build"));
    app.get("*", (res) => {
        res.sendFile(path_1.default.resolve(__dirname, "fishily-client", "build", "index.html"));
    });
}
app.listen(port, () => console.log(`Server is running on port: ${port}`));
//# sourceMappingURL=server.js.map