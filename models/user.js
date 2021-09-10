const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    balance: {
      type: Number,
      default: 500000000,
    },
  },
  {
    timestamps: true,
  }
);

// UserSchema.set("toJSON", {
//   virtuals: true,
// });

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    console.log("[USER]:[AUTH]:[ERROR]", err);
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

module.exports = User = mongoose.model("user", UserSchema);
