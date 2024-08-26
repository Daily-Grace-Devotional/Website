const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  topic: { type: String },
  text: { type: String },
  audioName: { type: String },
  imageName: { type: String },
  date: {
    type: String,
  },
});

const Post = mongoose.model('Devotion', postSchema);

module.exports = { Post };
