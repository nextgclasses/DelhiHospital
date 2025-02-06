const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  services: { type: String, required: true },
  doctor: { type: String, required: true },
  age: { type: Number, required: true },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
