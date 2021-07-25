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
        const data = yield db.Comment.find({});
        res.json({ comments: data });
    }
    catch (error) {
        if (error)
            console.log("error: ", error);
        res.json({ Error: "Unable to retrieve comments data." });
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db.Comment.findById(req.params.id).populate("user", {
            password: 0,
            bio: 0,
        });
        res.json({ comment: data });
    }
    catch (error) {
        if (error)
            console.log(error);
        res.json({ error: "unable to fetch comment" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const foundPost = yield db.Post.findById(postId);
        req.body.post = postId;
        const createdComment = yield db.Comment.create(req.body);
        if (foundPost) {
            foundPost.comments.push(createdComment._id);
            foundPost.save();
        }
        try {
            const foundUser = yield db.User.findById(createdComment.user);
            if (foundUser) {
                foundUser.comments.push(createdComment._id);
                foundUser.save();
            }
        }
        finally {
            res.json({ comment: createdComment });
        }
    }
    catch (error) {
        console.log("error creating comment: ", error);
        res.json({ Error: "Unable to create comment." });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    try {
        const updatedComment = yield db.Comment.findByIdAndUpdate(commentId, req.body, { new: true });
        res.json({ comment: updatedComment });
    }
    catch (error) {
        console.log("error updating comment: ", error);
        res.json({ Error: "Unable to update comment." });
    }
});
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    try {
        const deletedComment = yield db.Comment.findByIdAndDelete(commentId);
        if (deletedComment) {
            yield db.User.findOne({ comments: deletedComment._id }, (err, foundUser) => {
                if (err)
                    return console.log(err);
                if (foundUser) {
                    foundUser.comments.remove(deletedComment._id);
                    foundUser.save();
                }
            });
            yield db.Post.findOne({ comments: deletedComment._id }, (err, foundPost) => {
                if (err)
                    return console.log(err);
                foundPost.comments.remove(commentId);
                foundPost.save((err, _) => {
                    if (err)
                        return console.log(err);
                });
            });
            res.json({ deletedComment: deletedComment });
        }
    }
    catch (error) {
        console.log("error deleting comment: ", error);
        res.json({ Error: "unable to delete comment." });
    }
});
module.exports = {
    index,
    show,
    create,
    update,
    destroy,
};
//# sourceMappingURL=comments.js.map