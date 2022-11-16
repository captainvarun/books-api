const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const toJSON = require('./plugins/toJSON.js');
const config = require('../config/index.js');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: config.roles,
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isEmailAvailable = async function (email, excludeUserId) {
  const user = await User.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.method('isPasswordMatch', async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.plugin(toJSON);

const User = mongoose.model('User', userSchema);
module.exports = User;
