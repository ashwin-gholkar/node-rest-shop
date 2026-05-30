const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        const hashedPass = bcrypt.hashSync(req.body.password, 10);
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hashedPass,
        });
        user
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "User created",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      const passMatch = bcrypt.compareSync(req.body.password, user[0].password);
      if (passMatch) {
        res.status(200).json({
          message: "Auth successful",
        });
      } else {
        res.status(401).json({
          message: "Auth failed",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
