const db = require('../models');

// ALL COMMENTS
const index = (req,res) => {
  db.Comment.find({})
    .populate("post")
    .then((foundComments) => {
      res.json({ comments: foundComments });
    })
    .catch((err) => {
      console.log('error: ', err);
      res.json({ Error: 'Unable to retrieve comments data.'})
    })
};

// CREATE COMMENT
const create = (req, res) => {
  const postId = req.params.id;
  db.Post.findById(postId)
    .then((foundPost) => {
      console.log(foundPost)
      res.json({ post: foundPost})
    })
}

module.exports = {
  index,
  create
}