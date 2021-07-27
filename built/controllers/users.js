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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = __importStar(require("../models"));
const index = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUsers = yield db.User.find({}, { password: 0 });
        res.json({ users: foundUsers });
    }
    catch (error) {
        console.log(error);
        res.json({ error: "Unable to retrieve users." });
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield db.User.findById(req.params.id).populate("posts");
        res.json({ user: foundUser });
    }
    catch (error) {
        console.log("error fetching user data", error);
        res.json({ Error: "Unable to fetch user data" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.User.findOne({ username: req.body.username }, (err, user) => {
        if (err)
            return console.log(err);
        if (user) {
            console.log("User Account Already Exists.");
            return res.json({ Error: "User already exists." });
        }
        bcryptjs_1.default.genSalt(10, (err, salt) => {
            if (err)
                return console.log(err);
            bcryptjs_1.default.hash(req.body.password, salt, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    return console.log(err);
                try {
                    const user = yield db.User.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
                    res.json({ user: user });
                }
                catch (error) {
                    console.log("error creating user", error);
                    res.json({ Error: "Unable to create user." });
                }
            }));
        });
    });
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield db.User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ user: updatedUser });
    }
    catch (error) {
        console.log("error updating user", error);
        res.json({ Error: "unable to update user." });
    }
});
const logOut = (req, _) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return console.log("error logging out: ", err);
            }
        });
    }
};
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const deletedUser = yield db.User.findByIdAndDelete(userId);
        if (deletedUser) {
            yield db.Post.deleteMany({ _id: { $in: deletedUser.posts } });
            yield db.Comment.deleteMany({ _id: { $in: deletedUser.comments } });
            res.json({ user: deletedUser });
        }
    }
    catch (error) {
        console.log("error deleting user: ", error);
        res.json({ Error: "unable to delete user" });
    }
});
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.User.findOne({ username: req.body.username }, (err, user) => {
        if (err)
            return console.log(err);
        if (!user) {
            console.log("Login Route: No User Found");
            res.json({ error: "no user found." });
            return;
        }
        bcryptjs_1.default.compare(req.body.password, user.password, (err, isMatch) => {
            if (err)
                return console.log("error comparing passwords");
            if (isMatch) {
                req.session.currentUser = user;
                console.log("successfully logged in!");
                res.send(req.session.currentUser);
            }
            else {
                console.log('incorrect password.');
                res.json({ error: 'incorrect password.' });
            }
        });
    });
    console.log('res: ', res);
});
module.exports = {
    index,
    show,
    create,
    update,
    deleteUser,
    logIn,
    logOut,
};
//# sourceMappingURL=users.js.map