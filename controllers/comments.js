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

module.exports = {
  index,
}