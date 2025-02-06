// utils/SiteSettingData.js
const SiteSetting = require("../models/siteSettingModel");
const Doctor = require("../models/doctorModel");
const Services = require("../models/servicesModel");

const SiteSettingData = async () => {
  try {
    const siteSettings = await SiteSetting.find(); // Fetch all documents in the collection
    return siteSettings;
  } catch (err) {
    console.error("Error fetching site settings:", err.message);
    throw err; // Rethrow the error for handling at a higher level
  }
};

const AllDoctorsData = async () => {
  try {
    const doctors = await Doctor.find(); // Fetch all documents in the collection
    return doctors;
  } catch (err) {
    console.error("Error fetching site settings:", err.message);
    throw err; // Rethrow the error for handling at a higher level
  }
};
const AllServices = async () => {
  try {
    const services = await Services.find(); // Fetch all documents in the collection
    return services;
  } catch (err) {
    console.error("Error fetching site settings:", err.message);
    throw err; // Rethrow the error for handling at a higher level
  }
};

// Correctly export both functions
module.exports = {
  SiteSettingData,
  AllDoctorsData,
  AllServices,
};
