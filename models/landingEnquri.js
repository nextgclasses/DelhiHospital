const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, },
    email: { type: String,},
    phone: { type: String, },
    subject: { type: String, },
    message: { type: String, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppointmentLanding", appointmentSchema);
