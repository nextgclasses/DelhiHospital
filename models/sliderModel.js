const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  sliderImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Slider", sliderSchema);
