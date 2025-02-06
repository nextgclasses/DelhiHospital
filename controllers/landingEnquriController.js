const Appointment = require("../models/landingEnquri");

// ======================================================================== Create Appointment
const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Save the appointment to the database
    await newAppointment.save();

    // Redirect after successful creation
    return res.status(201).redirect("/landing");
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the appointment." });
  }
};


// ======================================================================== Show All Appointments in Admin Dashboard
// Function to get all appointments
const getAllAppointments = async () => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });  // Adjust the query if needed
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;  // Re-throw error so that it's handled in the route
  }
};
// ======================================================================== Delete Appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the appointment by ID
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    // If no appointment found, return 404
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Fetch remaining appointments
    const appointments = await Appointment.find();

    // Store data in session for success message
    req.session.appointments = appointments;
    req.session.message = {
      type: "success",
      message: "Appointment deleted successfully.",
    };

    // Redirect to all appointments page with message
    return res.redirect("/admin/allLandingAppointment");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the appointment." });
  }
};


module.exports = {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
};
