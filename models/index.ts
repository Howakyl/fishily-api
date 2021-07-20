const mongoose = require("mongoose");

const connectionString =
  process.env.NODE_ENV === "production"
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
  .catch((err: Error) => console.log(`MongoDB connection error: ${err}`));

export const User = require('./User')
export const Post = require('./Post')
export const Comment = require('./Comment')
