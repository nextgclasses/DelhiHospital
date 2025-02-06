const Doctor = require("../models/doctorModel");
const path = require("path");
const fs = require("fs");

//======================================================================== Add Doctor controller function
const addDoctor = async (req, res) => {
  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }
  try {
    const doctor = new Doctor({
      name: req.body.name,
      description:req.body.description,
      specialist: req.body.specialist,
      doctorImage: req.file.filename,
    });

    await doctor.save();
    req.session.message = {
      type: "success",
      message: "Doctor added successfully!",
    };
    res.redirect("/admin/allDoctors");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Add Doctor page
const addDoctorPage = (req, res) => {
  res.render("add_doctor", { title: "Add Doctor" });
};

const updateDoctorPage = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.render("update_doctor", {
      title: "Update Doctor",
      doctor: doctor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDoctor = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    //======================================================================== Update the doctor with the new or old image
    await Doctor.findByIdAndUpdate(id, {
      name: req.body.name,
      specialist: req.body.specialist,
      description: req.body.description,
      doctorImage: new_image,
    });

    //======================================================================== Set success message in session and redirect
    req.session.message = {
      type: "success",
      message: "Doctor updated successfully!",
    };
    res.redirect("/admin/allDoctors");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Delete Doctor controller function
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }
    const imagePath = path.join(__dirname, "..", "uploads", doctor.doctorImage);
    try {
      fs.unlinkSync(imagePath); 
    } catch (err) {
      console.log("Error deleting image:", err);
    }
    await Doctor.findByIdAndDelete(req.params.id);

    req.session.message = {
      type: "success",
      message: "Doctor deleted successfully!",
    };
    res.redirect("/admin/allDoctors");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== All Doctors Page controller function
const allDoctorsPage = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.render("all_doctor.ejs", { title: "All Doctors", doctors: doctors });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctors.");
  }
};

// ======================================================================== get all doctors for ui
const getAllDoctorsForIndex = async () => {
  try {
    return await Doctor.find();
  } catch (err) {
    throw new Error("Error fetching doctors");
  }
};

// get doctor details

const getDoctor = async (getDoctor) => {
  try {
    return await Doctor.findById(getDoctor);
  } catch (err) {
    throw new Error("Error fetching Service");
  }
};


module.exports = {
  addDoctorPage,
  getDoctor,
  getAllDoctorsForIndex,
  addDoctor,
  updateDoctorPage,
  updateDoctor,
  allDoctorsPage,
  deleteDoctor,
};
