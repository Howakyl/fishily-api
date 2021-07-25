import * as db from "../models";
import {Post as PostI} from '../models/Post';
import {User as UserI} from '../models/User';
import {Request, Response} from 'express';

// ALL POSTS

const index = async (_: any, res: Response) => {
  try {
    const foundPosts = await db.Post.find({}).populate("user", {
      password: 0,
      bio: 0,
    });
    res.json({ posts: foundPosts });
  } catch (error) {
    if (error) console.log(error);
    res.json({ error: "Unable to retrieve posts." });
  }
};

// SHOW POST
const show = async (req: Request, res: Response):Promise<void> => {
  try {
    const foundPost = await db.Post.findById(req.params.id)
      .populate("user", { password: 0, bio: 0 })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username picture",
        },
      });
    res.json({ post: foundPost });
  } catch (error) {
    if (error) console.log(error);
    res.json({ error: "unable to retrieve post data." });
  }
};

// CREATE Post
const create = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const foundUser = await db.User.findById(userId);
    req.body.user = userId;
    const createdPost = await db.Post.create(req.body);
    if (foundUser) {
      foundUser.posts.push(createdPost._id);
      await foundUser.save();
      res.json({ post: createdPost });
    }
  } catch (error) {
    if (error) console.log(error);
    res.json({ Error: "No user found." });
  }
};

//UPDATE POST
const update = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const updatedPost = await db.Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    res.json({ post: updatedPost });
  } catch (error) {
    console.log("error updating post", error);
    res.json({ Error: "unable to update post." });
  }
};

//DELETE POST, DELETES POST ON USER, COMMENTS FROM USER

const destroy = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const deletedPost: PostI | null = await db.Post.findByIdAndDelete(postId);
    await db.Comment.deleteMany({ _id: { $in: deletedPost!.comments } });
    await db.User.findOne({ posts: deletedPost!._id }, (error: Error, foundUser: UserI) => {
      if (error) return console.log(error);
      foundUser.posts.remove(deletedPost!._id);
      if (deletedPost) {
        if (deletedPost.comments.length > 0) {
          foundUser.comments.remove(deletedPost.comments);
        } 
        foundUser.save();
      }
    });
    res.json({ post: deletedPost });
  } catch (error) {
    console.log("error deleting post: ", error);
    res.json({ Error: "unable to delete post." });
  }
};

// ALL POST COMMENTS
const comments = (req: Request, res: Response) => {
  db.Post.findById(req.params.id)
    .populate("comments")
    .then((foundPost: any) => {
      res.json({ comments: foundPost.comments });
    })
    .catch((err: Error) => {
      if (err) console.log(err);
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
