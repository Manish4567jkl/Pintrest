const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost:27017/Pintrest");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName:String
});

// Apply passport-local-mongoose plugin directly to the schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;