const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: ' ',
    minlength: 2,
    maxlength: 30,
    require: [true, 'Please add a name']
  },
  email: {
    type: String,
    trim: ' ',
    minlength: 5,
    maxlength: 100,
    required: [true, 'Please add a valid email address'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    trim: ' ',
    minlength: 10,
    maxlength: 30,
  },

  password: {
    type: String,
    required:[true, 'Please add a password'],
    minlength: 8,
    select: false,
    match: [
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
      'password must contain at least one digit, one lower case, one upper case'
    ]
  },
  avatar: {
    type: String
  },
  tokens: [{
    token: {
        type: String,
        required: true
    }
}],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

const User = mongoose.model('user', UserSchema);

module.exports = User 