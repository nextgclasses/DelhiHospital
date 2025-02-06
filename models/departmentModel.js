const mongoose = require("mongoose");

const departmentsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  departmentImage: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DepartmentSchema", departmentsSchema);
