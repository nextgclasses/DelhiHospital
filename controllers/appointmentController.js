const Appointment = require("../models/appointmentModel");
// ======================================================================== create appointment
const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, services, doctor, age } = req.body;
    if (!name || !email || !phone || !services || !doctor || !age) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingAppointment = await Appointment.findOne({ email });
    if (existingAppointment) {
      return res.status(400).json({
        message: "This email is already registered for an appointment.",
      });
    }

    const newAppointment = new Appointment({
      name,
      email,
      phone,
      services,
      doctor,
      age,
    });

    await newAppointment.save();

    res.redirect("/appointment");
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the appointment." });
  }
};

// ======================================================================== show all appointments in admin dashboard

const getAllAppointmentForIndex = async () => {
  try {
    return await Appointment.find();
  } catch (err) {
    throw new Error("Error fetching appointments");
  }
};

// ======================================================================== delete all appointments
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const appointments = await Appointment.find();

    // Store data in session
    req.session.appointments = appointments;
    req.session.message = {
      type: "success",
      message: "Appointment deleted successfully.",
    };

    res.redirect("/admin/allAppointment");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the appointment." });
  }
};

module.exports = {
  createAppointment,
  getAllAppointmentForIndex,
  deleteAppointment,
};
