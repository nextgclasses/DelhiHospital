const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialist: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  doctorImage: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
