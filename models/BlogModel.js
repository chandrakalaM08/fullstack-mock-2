const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    username: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    likes: { type: Number, required: true },
    comments: [],
  },
  {
    versionKey: false,
  }
);

const BlogModel = mongoose.model("blog", blogSchema);

module.exports = { BlogModel };
