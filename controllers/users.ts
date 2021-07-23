import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { MyContext } from "../types/types";
import * as db from "../models";
import {User as UserI} from '../models/User';

// ALL USERS
const index = (_: any, res: Response) => {
  db.User.find({}, { password: 0 })
    .then((foundUsers) => {
      res.json({ users: foundUsers });
    })
    .catch((err) => {
      console.log("error: ", err);
      res.json({ Error: "Unable to retrieve user data. " });
    });
};

// SHOW ONE User
const show = (req: Request, res: Response) => {
  db.User.findById(req.params.id)
    .populate("posts")
    .then((foundUser: (UserI | null)) => {
      res.json({ user: foundUser });
    })
    .catch((err) => {
      console.log("error fetching user data", err);
      res.json({ Error: "Unable to fetch user data" });
    });
};

// CREATE USER
const create = (req: Request, res: Response) => {
  db.User.findOne({ username: req.body.username }, (err: Error, user: UserI) => {
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
const update = (req: Request, res: Response) => {
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
const logOut = (req: Request, _: any) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return console.log("error logging out: ", err);
      }
      // ELSE:
      // req.session = null;
    });
  }
};

// DELETE USER
const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const deletedUser = await db.User.findByIdAndDelete(userId);
    if (deletedUser) {
      await db.Post.deleteMany({ _id: { $in: deletedUser.posts } });
      await db.Comment.deleteMany({ _id: { $in: deletedUser.comments } });
      res.json({ user: deletedUser });
    }
  } catch (error) {
    console.log("error deleting user: ", error);
    res.json({ Error: "unable to delete user" });
  }
};

// LOG IN USER
const logIn = (req: MyContext["req"], res: Response) => {
  db.User.findOne({ username: req.body.username }, (err: Error, user: any) => {
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
