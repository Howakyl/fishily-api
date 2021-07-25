import * as db from "../models";
import { Request, Response } from "express";
import { Post as PostI } from "../models/Post";
import { User as UserI } from "../models/User";

// ALL COMMENTS
const index = async (_: any, res: Response): Promise<void> => {
  try {
    const data = await db.Comment.find({});
    res.json({ comments: data });
  } catch (error) {
    if (error) console.log("error: ", error);
    res.json({ Error: "Unable to retrieve comments data." });
  }
};

// SHOW ONE COMMENT
const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.Comment.findById(req.params.id).populate("user", {
      password: 0,
      bio: 0,
    });
    res.json({ comment: data });
  } catch (error) {
    if (error) console.log(error);
    res.json({ error: "unable to fetch comment" });
  }
};

// CREATE COMMENT
const create = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id;
  try {
    const foundPost: PostI | null = await db.Post.findById(postId);
    req.body.post = postId;
    const createdComment = await db.Comment.create(req.body);
    if (foundPost) {
      foundPost.comments.push(createdComment._id);
      foundPost.save();
    }
    try {
      const foundUser = await db.User.findById(createdComment.user);
      if (foundUser) {
        foundUser.comments.push(createdComment._id);
        foundUser.save();
      }
    } finally {
      res.json({ comment: createdComment });
    }
  } catch (error) {
    console.log("error creating comment: ", error);
    res.json({ Error: "Unable to create comment." });
  }
};

// EDIT COMMENT
const update = async (req: Request, res: Response): Promise<void> => {
  const commentId = req.params.id;
  try {
    const updatedComment = await db.Comment.findByIdAndUpdate(
      commentId,
      req.body,
      { new: true }
    );
    res.json({ comment: updatedComment });
  } catch (error) {
    console.log("error updating comment: ", error);
    res.json({ Error: "Unable to update comment." });
  }
};

// DELETE COMMENT, REMOVE FROM POST AND USER
const destroy = async (req: Request, res: Response): Promise<void> => {
  const commentId = req.params.id;
  try {
    const deletedComment = await db.Comment.findByIdAndDelete(commentId);
    if (deletedComment) {
      await db.User.findOne(
        { comments: deletedComment._id },
        (err: Error, foundUser: UserI) => {
          if (err) return console.log(err);
          if (foundUser) {
            foundUser.comments.remove(deletedComment._id);
            foundUser.save();
          }
        }
      );
      await db.Post.findOne(
        { comments: deletedComment._id },
        (err: Error, foundPost: any) => {
          if (err) return console.log(err);
          foundPost.comments.remove(commentId);
          foundPost.save((err: Error, _: any) => {
            if (err) return console.log(err);
          });
        }
      );
      res.json({ deletedComment: deletedComment });
    }
  } catch (error) {
    console.log("error deleting comment: ", error);
    res.json({ Error: "unable to delete comment." });
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
