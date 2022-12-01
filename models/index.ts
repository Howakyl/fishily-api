import mongoose from "mongoose";
import User from "./User";
import Post from "./Post";
import Comment from "./Comment";

const connectionString: string | undefined =
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
  .connect(connectionString as string, configOptions)
  .then(() => console.log("MongoDB successfully connected..."))
  .catch((err: Error) => console.log(`MongoDB connection error: ${err}`));

export { User, Post, Comment };
