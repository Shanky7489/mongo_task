const mongoose = require("mongoose");
const { Schema } = mongoose;

// Comment Schema (nested inside Post Schema)
const commentSchema = new Schema(
  {
    user: { type: String, required: true },
    comment: { type: String, required: true },
    replies: [
      {
        user: { type: String, required: true },
        reply: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Post Schema
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, require: true },
    comments: [commentSchema], // Array of comments
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
