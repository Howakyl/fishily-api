const db = require("../models");

const index = async (req, res) => {
  try {
    const data = await db.Comment.find({}).populate("post");
    res.json({ comments: data });
  } catch (error) {
    if (error) console.log("error: ", error);
    res.json({ Error: "Unable to retrieve comments data." });
  }
};

const show = async (req, res) => {
  try {
    const data = await db.Comment.findById(req.params.id).populate("user");
    res.json({ comment: data });
  } catch (error) {
    if (error) console.log(error);
    res.json({ error: "unable to fetch comment" });
  }
};

// CREATE COMMENT
const create = async (req, res) => {
  const postId = req.params.id;
  try {
    const foundPost = await db.Post.findById(postId);
    const createdComment = await db.Comment.create(req.body);
    foundPost.comments.push(createdComment._id);
    foundPost.save((err, savedPost) => {
      if (err) return console.log(err);
    });
    const foundUser = await db.User.findById(createdComment.user);
    foundUser.comments.push(createdComment._id);
    foundUser.save((err, savedUser) => {
      if (err) return console.log(err);
    });
    res.json({ comment: createdComment });
  } catch (error) {
    console.log("error creating comment: ", error);
    res.json({ Error: "Unable to create comment." });
  }
};

// DELETE COMMENT
const destroy = (req, res) => {
  const commentId = req.params.id;
  db.Comment.findByIdAndDelete(commentId)
    .then((deletedComment) => {
      db.User.findOne({ comments: commentId }, (err, foundUser) => {
        if (err) return console.log(err);

        if (foundUser) {
          foundUser.comments.remove(commentId);
          foundUser.save((err, savedUser) => {
            if (err) return console.log(err);
          });
        }
      });
      db.Post.findOne({ comments: commentId }, (err, foundPost) => {
        if (err) return console.log(err);
        foundPost.comments.remove(commentId);
        foundPost.save((err, savedPost) => {
          if (err) return console.log(err);
        });
      });
      res.json({ deletedComment: deletedComment });
    })
    .catch((err) => {
      console.log("error deleting comment: ", err);
      res.json({ Error: "unable to delete comment." });
    });
};

module.exports = {
  index,
  create,
  destroy,
  show,
};
