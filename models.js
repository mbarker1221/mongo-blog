'use strict';
const mongoose = require('mongoose');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

const blogPostSchema = mongoose.Schema({
  id: uuid.v4(),
  author: {
    {firstName: String,
    lastName: String
  },required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('authorName').get(function () {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});


blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost: createBlogPostsModel()};






