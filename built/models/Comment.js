"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
    },
}, { timestamps: true });
const Comment = mongoose_1.model("Comment", CommentSchema);
exports.default = Comment;
//# sourceMappingURL=Comment.js.map