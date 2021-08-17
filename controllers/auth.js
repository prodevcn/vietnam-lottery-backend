const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");
const nodeMailer = require("nodemailer");

const { setUserInfo } = require("../helpers");
const conf = require("../config/main");
const User = require("../models/user");

const generateToken = (user) => {
  return jwt.sign(user, conf.secret, {
    expiresIn: 604800,
  });
};

exports.login = (req, res) => {
  const user = req.user;
  const token = `JWT ${generateToken(setUserInfo(user))}`;

  console.log("[SUCCESS]:[USER_LOGIN]");

  return res.status(200).json({
    token: token,
    user: user,
  });
};

exports.getUserInfo = (req, res) => {
  const { userId } = req.params;
  User.findOne({ _id: userId })
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      console.log("[ERROR]:[GET_USER_INFO]");
    });
};

exports.register = (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email) {
    return res.json({ error: "You must enter an email address." });
  }

  if (!password) {
    return res.json({ error: "You must enter a password." });
  }

  User.findOne({ email })
    .then(async (user) => {
      if (user) {
        console.log(`[ERROR]:[USE_ALREADY_EXISTED_MAIL_ADDRESS]`);
        return res.json({ error: "That email address is already in use" });
      }
      const newUser = new User({
        email,
        password,
        firstName,
        lastName,
      });
      const SALT_FACTOR = 5;
      await bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(newUser.password, salt, null, (err1, hash) => {
          if (err1) next(err1);
          newUser.password = hash;
        });
      });
      newUser
        .save()
        .then((savedUser) => {
          console.log("[SUCCESS]:[USER_REGISTER]");
          return res.json({
            success: true,
            token: `JWT ${generateToken(setUserInfo(savedUser))}`,
            user: savedUser,
          });
        })
        .catch((err2) => {
          next(err2);
        });
    })
    .catch((err) => next(err));
};
