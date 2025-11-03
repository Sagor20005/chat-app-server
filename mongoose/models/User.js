// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    url: {
      type: String,
      default: ''
    },
    fileId: String,
    name: String
  },

  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },

  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],

  isVerified: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
