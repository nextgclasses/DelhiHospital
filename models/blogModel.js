const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  blogImage: {
    type: String,
    required: true,
  },
  seoTitle: { type: String },
  seoKeywords: { type: String },
  seoDescription: { type: String },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
