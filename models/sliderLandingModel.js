const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("SliderLanding", sliderSchema);
