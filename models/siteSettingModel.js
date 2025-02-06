const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  address: { type: String, required: true,},
  number: { type: String, required: true}, 
  facebook: { type: String, required: false },
  twitter: { type: String, required: false },
  pinterest: { type: String, required: false },
  instagram: { type: String, required: false },
  logo: { type: String, required: true },
});

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
