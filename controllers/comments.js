const db = require("../models");

// ALL COMMENTS
const index = async (req, res) => {
  try {
    const data = await db.Comment.find({});
    res.json({ comments: data });
  } catch (error) {
    if (error) console.log("error: ", error);
    res.json({ Error: "Unable to retrieve comments data." });
  }
};

// SHOW ONE COMMENT
const show = async (req, res) => {
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
const create = async (req, res) => {
  const postId = req.params.id;
  try {
    const foundPost = await db.Post.findById(postId);
    req.body.post = postId;
    const createdComment = await db.Comment.create(req.body);
    foundPost.comments.push(createdComment._id);
    foundPost.save();
    try {
      const foundUser = await db.User.findById(createdComment.user);
      foundUser.comments.push(createdComment._id);
      foundUser.save();
    } finally {
      res.json({ comment: createdComment });
    }
  } catch (error) {
    console.log("error creating comment: ", error);
    res.json({ Error: "Unable to create comment." });
  }
};

// EDIT COMMENT
const update = async (req, res) => {
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
const destroy = async (req, res) => {
  const commentId = req.params.id;
  try {
    const deletedComment = await db.Comment.findByIdAndDelete(commentId);
    await db.User.findOne({ comments: commentId }, (err, foundUser) => {
      if (err) return console.log(err);
      if (foundUser) {
        foundUser.comments.remove(commentId);
        foundUser.save((err, savedUser) => {
          if (err) return console.log(err);
        });
      }
    });
    await db.Post.findOne({ comments: commentId }, (err, foundPost) => {
      if (err) return console.log(err);
      foundPost.comments.remove(commentId);
      foundPost.save((err, savedPost) => {
        if (err) return console.log(err);
      });
    });
    res.json({ deletedComment: deletedComment });
  } catch (error) {
    console.log("error deleting comment: ", error);
    res.json({ Error: "unable to delete comment." });
  }
};

// REMOVE THIS AFTER TESTING
const dropAll = async (req, res) => {
  const foundUser = await db.User.findById(req.params.id);
  console.log(foundUser)
  foundUser.comments = []
  await foundUser.save()
  res.json({ deletedComments: foundUser.comments })
  // res.json({founduser: foundUser})
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
  dropAll
};
