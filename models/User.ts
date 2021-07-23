import { model, Schema, ObjectId, Document } from "mongoose";

export interface User extends Document {
  _id: ObjectId;
  picture?: string;
  posts: string[];
  comments: string[];
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
