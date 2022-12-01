"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 300,
    },
    fish: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    locationName: {
        type: String,
        default: "Unknown",
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Fish_icon.svg/1200px-Fish_icon.svg.png",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
}, { timestamps: true });
const Post = mongoose_1.model("Post", postSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map