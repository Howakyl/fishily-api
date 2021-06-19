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
  console.log(req)
  console.log(res)
  const postId = req.params.id;
  db.Post.findById(postId)
    .then((foundPost) => {
      db.Comment.create(req.body)
        .then((createdComment) => {
          foundPost.comments.push(createdComment._id);
          foundPost.save((err, savedPost) => {
            if (err) return console.log(err);
          });
          res.json({ comment: createdComment});
        })
        .catch((err) => {
          console.log('error creating comment', err);
          res.json({ Error: 'Unable to create comment.'})
        })
    })
}

module.exports = {
  index,
  create
}