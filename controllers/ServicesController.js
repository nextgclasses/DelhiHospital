const Service = require("../models/servicesModel");
const path = require("path");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//======================================================================== Add Service controller function
const addServices = async (req, res) => {
  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }
  const response = await uploadOnCloudinary(req.file.filename)

  try {
    const service = new Service({
      title: req.body.title,
      description: req.body.description,
      servicesImage: response,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
    });

    await service.save();
    req.session.message = {
      type: "success",
      message: "Service added successfully!",
    };
    res.redirect("/admin/allServices");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Add Service page
const addServicesPage = (req, res) => {
  res.render("add_services", { title: "Add Service" });
};

//======================================================================== Update Service controller function
const updateServicesPage = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.render("update_services", {
      title: "Update Service",
      service: service,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//======================================================================== Update the service with the new details
const updateServices = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      const response = await uploadOnCloudinary(req.file.filename)

      new_image = response;
      // try {
      //   fs.unlinkSync("./uploads" + req.body.old_image);
      // } catch (err) {
      //   console.log(err);
      // }
    } else {
      new_image = req.body.old_image;
    }

    await Service.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
      servicesImage: new_image,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
    });

    req.session.message = {
      type: "success",
      message: "Service updated successfully!",
    };
    res.redirect("/admin/allServices");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Delete Service controller function
const deleteServices = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).send("Service not found");
    }

    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      service.servicesImage
    );

    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.log("Error deleting image:", err);
    }

    await Service.findByIdAndDelete(req.params.id);

    req.session.message = {
      type: "success",
      message: "Service deleted successfully!",
    };
    res.redirect("/admin/allServices");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};


//======================================================================== All Services 
const allServicesPage = async (req, res) => {
  try {
    const services = await Service.find();

    res.render("all_services.ejs", {
      title: "All Services",
      services: services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching services.");
  }
};


// ======================================================================== all services show in ui
const getAllServicesForIndex = async () => {
  try {
    return await Service.find();
  } catch (err) {
    throw new Error("Error fetching services");
  }
};


const getService = async (getService) => {
  try {
    return await Service.findById(getService);
  } catch (err) {
    throw new Error("Error fetching Service");
  }
};

module.exports = {
  getAllServicesForIndex,
  addServicesPage,
  addServices,
  updateServicesPage,
  getService,
  updateServices,
  allServicesPage,
  deleteServices,
};
