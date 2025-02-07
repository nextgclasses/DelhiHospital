const SiteSetting = require("../models/siteSettingModel");

const upload = require("../middlewares/multerMiddleware");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//======================================================================== Render Site Settings page
const siteSettingsPage = async (req, res) => {
  try {
    const settings = await SiteSetting.findOne(); 
    res.render("site_setting.ejs", { title: "Site Setting", settings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading site settings.");
  }
};

//======================================================================== Render the page to display current Site Settings (GET)
const siteSettingsDisplayPage = async (req, res) => {
  try {
    const settings = await SiteSetting.findOne(); 
    if (!settings) {
      req.session.message = {
        type: "error",
        message: "No site settings found.",
      };
      return res.redirect("/admin/siteSetting");
    }

    res.render("all_siteSetting", {
      title: "Current Site Settings",
      settings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading site settings.");
  }
};

//======================================================================== Add Site Setting
const addSiteSetting = async (req, res) => {
  try {
      const response=await uploadOnCloudinary(req.file.filename)
  
    const siteSettingData = {
      email: req.body.email,
      address: req.body.address,
      number: req.body.number,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      pinterest: req.body.pinterest,
      instagram: req.body.instagram,
      logo: response, 
    };

    // Check if a site setting already exists
    const existingSetting = await SiteSetting.findOne();

    if (existingSetting) {
      // Update the existing site setting
      await SiteSetting.updateOne({}, siteSettingData);
      req.session.message = {
        type: "success",
        message: "Site setting updated successfully!",
      };
    } else {
      // Create a new site setting
      await SiteSetting.create(siteSettingData);
      req.session.message = {
        type: "success",
        message: "Site setting added successfully!",
      };
    }

    res.redirect("/admin/siteSettingsDisplay"); 
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "error",
      message: "Error adding/updating site setting.",
    };
    res.redirect("/admin/siteSetting");
  }
};

//======================================================================== Update Site Setting (PATCH)
const updateSiteSetting = async (req, res) => {
  try {
    const id = req.params.id;
    
    let newLogo = "";
    
    if (req.file) {
      const response=await uploadOnCloudinary(req.file.filename)
      newLogo = response;

      // // Delete the old logo if it exists
      // const setting = await SiteSetting.findById(id);
      // if (setting && setting.logo) {
      //   const oldLogoPath = path.join(__dirname, "..", "uploads", setting.logo);
      //   try {
      //     fs.unlinkSync(oldLogoPath);
      //   } catch (err) {
      //     console.error("Error deleting old logo:", err);
      //   }
      // }
    }

    const updatedData = {
      email: req.body.email,
      address: req.body.address,
      number: req.body.number,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      pinterest: req.body.pinterest,
      instagram: req.body.instagram,
      ...(req.file && { logo: newLogo }), // Include new logo only if uploaded
    };

    // Update the site setting
    await SiteSetting.findByIdAndUpdate(id, updatedData, { new: true });

    req.session.message = {
      type: "success",
      message: "Site setting updated successfully!",
    };
    res.redirect("/admin/siteSettingsDisplay"); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating site setting.");
  }
};




module.exports = {
  siteSettingsPage,
  siteSettingsDisplayPage,
  addSiteSetting,
  updateSiteSetting,
};
