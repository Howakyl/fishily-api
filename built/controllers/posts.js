"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("../models"));
const index = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundPosts = yield db.Post.find({}).populate("user", {
            password: 0,
            bio: 0,
        });
        res.json({ posts: foundPosts });
    }
    catch (error) {
        if (error)
            console.log(error);
        res.json({ error: "Unable to retrieve posts." });
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundPost = yield db.Post.findById(req.params.id)
            .populate("user", { password: 0, bio: 0 })
            .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username picture",
            },
        });
        res.json({ post: foundPost });
    }
    catch (error) {
        if (error)
            console.log(error);
        res.json({ error: "unable to retrieve post data." });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const foundUser = yield db.User.findById(userId);
        req.body.user = userId;
        const createdPost = yield db.Post.create(req.body);
        foundUser.posts.push(createdPost._id);
        yield foundUser.save();
        res.json({ post: createdPost });
    }
    catch (error) {
        if (error)
            console.log(error);
        res.json({ Error: "No user found." });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const updatedPost = yield db.Post.findByIdAndUpdate(postId, req.body, {
            new: true,
        });
        res.json({ post: updatedPost });
    }
    catch (error) {
        console.log("error updating post", error);
        res.json({ Error: "unable to update post." });
    }
});
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const deletedPost = yield db.Post.findByIdAndDelete(postId);
        yield db.Comment.deleteMany({ _id: { $in: deletedPost.comments } });
        yield db.User.findOne({ posts: postId }, (error, foundUser) => {
            if (error)
                return console.log(error);
            foundUser.posts.remove(postId);
            if (deletedPost.comments.length > 0) {
                foundUser.comments.remove(deletedPost.comments);
            }
            foundUser.save();
        });
        res.json({ post: deletedPost });
    }
    catch (error) {
        console.log("error deleting post: ", error);
        res.json({ Error: "unable to delete post." });
    }
});
const comments = (req, res) => {
    db.Post.findById(req.params.id)
        .populate("comments")
        .then((foundPost) => {
        res.json({ comments: foundPost.comments });
    })
        .catch((err) => {
        if (err)
            console.log(err);
        res.json({ Error: "Unable to fetch comments" });
    });
};
module.exports = {
    index,
    create,
    show,
    update,
    destroy,
    comments,
};
//# sourceMappingURL=posts.js.map