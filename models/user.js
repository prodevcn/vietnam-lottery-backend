const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 12000
    }
},{
    timestamps: true
});

UserSchema.set('toJSON', {
    virtuals: true
});


UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      console.log('[USER]:[AUTH]:[ERROR]', err);
      if (err) { return cb(err); }
  
      cb(null, isMatch);
    });
  };

module.exports = User = mongoose.model("user", UserSchema);