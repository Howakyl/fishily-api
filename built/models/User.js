"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    bio: {
        type: String,
        maxlength: 200,
    },
    picture: {
        type: String,
        default: "https://www.abc.net.au/cm/rimage/11851850-3x2-large.jpg?v=2",
    },
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
}, { timestamps: true });
const User = mongoose_1.model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map