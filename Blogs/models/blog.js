const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true
  },
  id:{
    type: String,
    required: false
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;