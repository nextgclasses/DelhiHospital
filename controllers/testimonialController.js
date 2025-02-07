const Testimonial = require("../models/testimonialsModel");
const path = require("path");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//======================================================================== Add Testimonial Controller
const addTestimonial = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Image upload failed", type: "danger" });
  }
            const response = await uploadOnCloudinary(req.file.filename)

  try {
    const testimonial = new Testimonial({
      name: req.body.name,
      description: req.body.description,
      testimonialImage: response,
    });

    await testimonial.save();

    req.session.message = {
      type: "success",
      message: "Testimonial added successfully!",
    };
    res.redirect("/admin/allTestimonial");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add testimonial", error: err.message });
  }
};

//======================================================================== Render Add Testimonial Page
const addTestimonialPage = (req, res) => {
  res.render("add_testimonial", { title: "Add Testimonial" });
};

//======================================================================== Render Update Testimonial Page
const updateTestimonialPage = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.render("update_testimonial", {
      title: "Update Testimonial",
      testimonial,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load testimonial", error: err.message });
  }
};

//======================================================================== Update Testimonial Controller
const updateTestimonial = async (req, res) => {
  const id = req.params.id;
  let newImage = "";

  try {
    if (req.file) {
      const response = await uploadOnCloudinary(req.file.filename)
      newImage = response;
    } else {
      newImage = req.body.old_image;
    }

    await Testimonial.findByIdAndUpdate(id, {
      name: req.body.name,
      description: req.body.description,
      testimonialImage: newImage,
    });

    req.session.message = {
      type: "success",
      message: "Testimonial updated successfully!",
    };
    res.redirect("/admin/allTestimonial");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update testimonial", error: err.message });
  }
};

//======================================================================== Delete Testimonial Controller
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    req.session.message = {
      type: "success",
      message: "Testimonial deleted successfully!",
    };
    res.redirect("/admin/allTestimonial");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete testimonial", error: err.message });
  }
};

//======================================================================== All Testimonials Page Controller
const allTestimonialsPage = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();

    res.render("all_testimonial", {
      title: "All Testimonials",
      testimonials,
    });
  } catch (err) {
    res.status(500).send("Error fetching testimonials.");
  }
};

//======================================================================== Fetch All Testimonials for Index Page
const getAllTestimonialsForIndex = async () => {
  try {
    return await Testimonial.find();
  } catch (err) {
    throw new Error("Error fetching testimonials");
  }
};


module.exports = {
  addTestimonialPage,
  getAllTestimonialsForIndex,
  addTestimonial,
  updateTestimonialPage,
  updateTestimonial,
  allTestimonialsPage,
  deleteTestimonial,
};
