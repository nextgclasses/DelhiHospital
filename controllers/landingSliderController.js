const SliderLanding = require("../models/sliderLandingModel");
const fs = require("fs");
const path = require("path");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//======================================================================== Add Slider 
const addLandingSlider = async (req, res) => {
  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }    
    const response = await uploadOnCloudinary(req.file.filename)
  

  try {
    const slider = new SliderLanding({
      sliderImage: response,
      title: req.body.title,
      description: req.body.description,
    });

    await slider.save();

    req.session.message = {
      type: "success",
      message: "Slider added successfully!",
    };
    res.redirect("/admin/allLandingSliders");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};


//======================================================================== Render Add Slider page
const addLandingSliderPage = (req, res) => {
  res.render("add_slider_landing.ejs", { title: "Add Slider" });
};

//======================================================================== Update Slider controller function
const updateLandingSlider = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    // Check if a new image is uploaded
    if (req.file) {
            const response = await uploadOnCloudinary(req.file.filename)
      
      new_image = response;
     
    } else {
      new_image = req.body.old_image;
    }

    // Update the slider with the new or old image, title, and description
    await SliderLanding.findByIdAndUpdate(id, {
      sliderImage: new_image,
      title: req.body.title, // Title from the form input
      description: req.body.description, // Description from the form input
    });

    // Set success message in session and redirect
    req.session.message = {
      type: "success",
      message: "Slider updated successfully!",
    };
    res.redirect("/admin/allLandingSliders");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};


//======================================================================== Render Update Slider page
const updateLandingSliderPage = async (req, res) => {
  try {
    const slider = await SliderLanding.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.render("update_slider_landing", {
      title: "Update Slider",
      slider: slider, // Now includes title and description in the slider object
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//======================================================================== Delete Slider controller function
const deleteLandingSlider = async (req, res) => {
  try {
    // Find the slider by its ID
    const slider = await SliderLanding.findById(req.params.id);
    
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
    await SliderLanding.findByIdAndDelete(req.params.id);

    // Set success message and redirect
    req.session.message = {
      type: "success",
      message: "Slider deleted successfully!",
    };
    res.redirect("/admin/allLandingSliders");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== All Sliders Page controller function
const allLandingSlidersPage = async (req, res) => {
  try {
    const landingSlider = await SliderLanding.find();

    res.render("all_slider_landing", {
      title: "All Sliders",
      landingSlider: landingSlider,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sliders.");
  }
};

// ======================================================================== fath all sliders image for ui 
const SliderLandingPageForIndex = async () => {
  try {
    return await SliderLanding.find(); 
  } catch (err) {
    console.error("Error fetching sliders:", err.message);
    throw new Error("Error fetching sliders");
  }
};



module.exports = {
  addLandingSliderPage,
  SliderLandingPageForIndex,
  addLandingSlider,
  updateLandingSliderPage,
  updateLandingSlider,
  allLandingSlidersPage,
  deleteLandingSlider,
};
