import { model, Schema, Document } from "mongoose";
import { User } from "./User";

export interface Post extends Document {
  title: string;
  description: string;
  fish: string;
  date: Date;
  locationName: string;
  lat: number;
  lng: number;
  image: string;
  user: User;
  comments: string[];
}

const postSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 300,
    },
    fish: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    locationName: {
      type: String,
      default: "Unknown",
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Fish_icon.svg/1200px-Fish_icon.svg.png",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = model<Post>("Post", postSchema);
export default Post;
