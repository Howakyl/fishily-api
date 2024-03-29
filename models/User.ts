import { model, Schema, Document } from "mongoose";
import { Post } from "./Post";
import { Comment } from "./Comment";

export interface User extends Document {
  picture?: string;
  posts: Post & Post[];
  comments: Comment & Comment[];
  username: string;
  lastName?: string;
  firstName?: string;
  password: string;
  bio?: string;
}

const UserSchema = new Schema<User>(
  {
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
  },
  { timestamps: true }
);

const User = model<User>("User", UserSchema);
export default User;
