const mongoose = require('mongoose');
const plm=require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestClone")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
    
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Assuming you have a Post model for user posts
  }],
  dp: {
    type: String, // You can use String to store the URL of the profile picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

userSchema.plugin(plm);


const User = mongoose.model('User', userSchema);

module.exports = User;
