const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  servicesImage: {
    type: String,
    required: true,
  },
  seoTitle: { type: String },
  seoKeywords: { type: String },
  seoDescription: { type: String },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Services", servicesSchema);
