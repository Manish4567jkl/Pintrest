const mongoose = require('mongoose');
const passport = require('passport');
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://localhost:27017/Pintrest")
//! user Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password:  String,
  posts: [{
   type:mongoose.Schema.Types.ObjectId,
   ref : 'Post'
  }],
  dp: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  }
});

userSchema.plugin(plm)
const User = mongoose.model('User', userSchema);
module.exports = User;
