const db = require("../models/");

// ALL POSTS
const index = async (req, res) => {
  try {
    const foundPosts = await db.Post.find({}).populate("user");
    res.json({ posts: foundPosts });
  } catch (error) {
    if (error) console.log(error);
    res.json({ error: "Unable to retrieve posts." });
  }
};

// SHOW POST
const show = async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id)
      .populate("user", {password: 0, bio: 0})
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username picture"
        }
      });
    res.json({ post: foundPost });
  } catch (error) {
    if (error) console.log(error);
    res.json({ error: "unable to retrieve post data." });
  }
};

// ADD POSTS
const create = async (req, res) => {
  const userId = req.params.id;
  try {
    const foundUser = await db.User.findById(userId);
    req.body.user = userId;
    const createdPost = await db.Post.create(req.body);
    foundUser.posts.push(createdPost._id);
    await foundUser.save();
    res.json({ post: createdPost });
  } catch (error) {
    if (error) console.log(error);
    res.json({ Error: "No user found."})
  }
}

//UPDATE POST
const update = (req, res) => {
  db.Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedPost) => {
      res.json({ post: updatedPost });
    })
    .catch((err) => {
      console.log("error updating post: ", err);
      res.json({ Error: "Unable to update post. " });
    });
};

//DELETE POST, DELETES POST ON USER
const destroy = (req, res) => {
  const postId = req.params.id;

  db.Post.findByIdAndDelete(postId)
    .then((deletedPost) => {
      db.User.findOne({ posts: postId }, (err, foundUser) => {
        if (err) return console.log(err);

        foundUser.posts.remove(postId);
        foundUser.save((err, savedUser) => {
          if (err) return console.log(err);
        });
      });

      res.json({ post: deletedPost });
    })
    .catch((err) => {
      console.log("error deleting post: ", err);
      res.json({ Error: "unable to delete post." });
    });
};

// ALL POST COMMENTS
const comments = (req, res) => {
  db.Post.findById(req.params.id)
    .populate("comments")
    .then((foundPost) => {
      res.json({ comments: foundPost.comments });
    })
    .catch((err) => {
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
