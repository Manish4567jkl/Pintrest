const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/posts")
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  likes: {
    type: Array,
    default: []
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
