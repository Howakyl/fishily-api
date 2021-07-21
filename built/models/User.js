"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
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
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
}, { timestamps: true });
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map