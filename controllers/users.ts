const bcrypt = require("bcryptjs");
const db = require("../models");

// ALL USERS
const index = (req, res) => {
  db.User.find({}, { password: 0 })
    .then((foundUsers) => {
      res.json({ users: foundUsers });
    })
    .catch((err) => {
      console.log("error: ", err);
      res.json({ Error: "Unable to retrieve user data. " });
    });
};

// SHOW ONE USEr
const show = (req, res) => {
  db.User.findById(req.params.id)
    .populate("posts")
    .then((foundUser) => {
      res.json({ user: foundUser });
    })
    .catch((err) => {
      console.log("error fetching user data", err);
      res.json({ Error: "Unable to fetch user data" });
    });
};

// CREATE USER
const create = (req, res) => {
  db.User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return console.log(err);

    if (user) {
      console.log("User Account Already Exists");
      return res.json({ Error: "User already exists." });
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return console.log(err);

      bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) return console.log(err);

        const newUser = {
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashedPassword,
          bio: req.body.bio,
        };

        db.User.create(newUser)
          .then((createdUser) => {
            res.json({ user: createdUser });
          })
          .catch((err) => {
            console.log("error creating user: ", err);
            res.json({ Error: "Unable to create user." });
          });
      });
    });
  });
};

// UPDATE USER
const update = (req, res) => {
  db.User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedUser) => {
      res.json({ user: updatedUser });
    })
    .catch((err) => {
      console.log("error updating user: ", err);
      res.json({ Error: "Unable to update user." });
    });
};

// LOG OUT USER
const logOut = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return console.log('error logging out: ',err)
      } else {
        req.session = null;

      }
    })
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await db.User.findByIdAndDelete(userId);
    await db.Post.deleteMany({ _id: { $in: deletedUser.posts } });
    await db.Comment.deleteMany({ _id: { $in: deletedUser.comments } });
    res.json({ user: deletedUser });
  } catch (error) {
    console.log("error deleting user: ", error);
    res.json({ Error: "unable to delete user" });
  }
};

// LOG IN USER
const logIn = (req, res) => {
  db.User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return console.log(err);

    if (!user) {
      console.log("Login Route: No User Found");
      res.json({ Error: "no user found." });
    }

    // Verify user password with login password
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) return console.log("error comparing passwords");

      if (isMatch) {
        req.session.currentUser = user;
        console.log("successfully logged in!");
        res.send(req.session.currentUser);
      }
    });
  });
};

module.exports = {
  index,
  show,
  create,
  update,
  deleteUser,
  logIn,
  logOut,
};
