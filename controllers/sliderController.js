const Slider = require("../models/sliderModel");
const fs = require("fs");
const path = require("path");

//======================================================================== Add Slider 
const addSlider = async (req, res) => {
  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }

  try {
    const slider = new Slider({
      sliderImage: req.file.filename,
      title: req.body.title, 
      description: req.body.description, 
    });

    await slider.save();

    req.session.message = {
      type: "success",
      message: "Slider added successfully!",
    };
    res.redirect("/admin/allSliders");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};


//======================================================================== Render Add Slider page
const addSliderPage = (req, res) => {
  res.render("add_slider.ejs", { title: "Add Slider" });
};

//======================================================================== Update Slider controller function
const updateSlider = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    // Check if a new image is uploaded
    if (req.file) {
      new_image = req.file.filename;
      // Optionally delete the old image from the server
      try {
        fs.unlinkSync("./uploads" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    // Update the slider with the new or old image, title, and description
    await Slider.findByIdAndUpdate(id, {
      sliderImage: new_image,
      title: req.body.title, // Title from the form input
      description: req.body.description, // Description from the form input
    });

    // Set success message in session and redirect
    req.session.message = {
      type: "success",
      message: "Slider updated successfully!",
    };
    res.redirect("/admin/allSliders");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};


//======================================================================== Render Update Slider page
const updateSliderPage = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.render("update_slider", {
      title: "Update Slider",
      slider: slider, // Now includes title and description in the slider object
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//======================================================================== Delete Slider controller function
const deleteSlider = async (req, res) => {
  try {
    // Find the slider by its ID
    const slider = await Slider.findById(req.params.id);
    
    if (!slider) {
      return res.status(404).send("Slider not found");
    }

    // Get the image file path from the slider object
    const imagePath = path.join(__dirname, '..', 'uploads', slider.sliderImage);

    // Delete the image file from the server
    try {
      fs.unlinkSync(imagePath); // Delete the file from the uploads folder
    } catch (err) {
      console.log('Error deleting image:', err);
    }

    // Now delete the slider record from the database
    await Slider.findByIdAndDelete(req.params.id);

    // Set success message and redirect
    req.session.message = {
      type: "success",
      message: "Slider deleted successfully!",
    };
    res.redirect("/admin/allSliders");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== All Sliders Page controller function
const allSlidersPage = async (req, res) => {
  try {
    const sliders = await Slider.find();

    res.render("all_slider", { title: "All Sliders", sliders: sliders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sliders.");
  }
};

// ======================================================================== fath all sliders image for ui 
const SliderPageForIndex = async () => {
  try {
    return await Slider.find();
  } catch (err) {
    throw new Error("Error fetching sliders");
  }
};


module.exports = {
  addSliderPage,
  SliderPageForIndex,
  addSlider,
  updateSliderPage,
  updateSlider,
  allSlidersPage,
  deleteSlider,
};
