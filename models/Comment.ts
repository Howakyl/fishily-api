import { model, Schema, Document } from "mongoose";
import { User } from "./User";
import { Post } from "./Post";

export interface Comment extends Document {
  description: string;
  date: Date;
  user: User;
  post: Post;
}

const CommentSchema = new Schema<Comment>(
  {
    description: {
      type: String,
      maxlength: 300,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = model<Comment>("Comment", CommentSchema);
export default Comment;
