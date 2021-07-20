"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Post = exports.User = void 0;
const mongoose = require("mongoose");
const connectionString = process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : process.env.MONGODB_DEV;
const configOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose
    .connect(connectionString, configOptions)
    .then(() => console.log("MongoDB successfully connected..."))
    .catch((err) => console.log(`MongoDB connection error: ${err}`));
exports.User = require('./User');
exports.Post = require('./Post');
exports.Comment = require('./Comment');
//# sourceMappingURL=index.js.map