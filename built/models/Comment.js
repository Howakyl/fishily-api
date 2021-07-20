"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CommentSchema = new Schema({
    description: {
        type: String,
        maxlength: 300,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
    },
}, { timestamps: true });
const Comment = mongoose_1.default.model("Comment", CommentSchema);
exports.default = Comment;
//# sourceMappingURL=Comment.js.map