"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Post = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Post_1 = __importDefault(require("./Post"));
exports.Post = Post_1.default;
const Comment_1 = __importDefault(require("./Comment"));
exports.Comment = Comment_1.default;
const connectionString = process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : process.env.MONGODB_DEV;
const configOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose_1.default
    .connect(connectionString, configOptions)
    .then(() => console.log("MongoDB successfully connected..."))
    .catch((err) => console.log(`MongoDB connection error: ${err}`));
//# sourceMappingURL=index.js.map