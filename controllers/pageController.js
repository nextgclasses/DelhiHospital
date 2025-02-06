const Page = require("../models/pageModel");
const path = require("path");
const fs = require("fs");

//========================================================================== Add Page Controller Function
const addPage = async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.file) {
      req.session.message = {
        type: "danger",
        message: "Image upload failed. Please try again.",
      };
      return res.redirect("/admin/add-page");
    }

    // Create a new page entry
    const page = new Page({
      name: req.body.name,
      url: req.body.url,
      heading: req.body.heading,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      pageImage: req.file.filename,
      status: req.body.status || "active",
    });
    await page.save();

    req.session.message = {
      type: "success",
      message: "Page added successfully!",
    };

    res.redirect("/admin/all-pages");
  } catch (err) {
    console.error("Error adding page:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while adding the page. Please try again.",
    };
    res.redirect("/admin/add-page");
  }
};

//========================================================================== Add Page Render Function
const addPageView = (req, res) => {
  const message = req.session.message || null;
  req.session.message = null;
  res.render("addPage", { message });
};

//========================================================================== All Pages Controller Function
const allPages = async (req, res) => {
  try {
    const pages = await Page.find();

    res.render("allPages", {
      pages,
      message: req.session.message || null,
    });

    req.session.message = null;
  } catch (err) {
    console.error("Error fetching pages:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while retrieving pages. Please try again.",
    };
    res.redirect("/admin/dashboard");
  }
};

//========================================================================== Update Page Render Function
const updatePageView = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ message: "page not found" });
    }

    res.render("updatePage.ejs", { title: "Update Page", page: page });
  } catch (err) {
    console.error("Error loading update page:", err.message);
    res.redirect("/admin/all-pages");
  }
};

//========================================================================== Update Page Controller Function
const updatePage = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      new_image = req.file.filename;

      // Delete the old image if it exists
      if (req.body.old_image) {
        const oldImagePath = "./uploads/" + req.body.old_image;
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
    } else {
      // Retain the old image if no new image is uploaded
      new_image = req.body.old_image;
    }

    // Update the page in the database
    await Page.findByIdAndUpdate(id, {
      name: req.body.name,
      url: req.body.url,
      heading: req.body.heading,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      pageImage: new_image,
      status: req.body.status || "active",
    });

    req.session.message = {
      type: "success",
      message: "Page updated successfully!",
    };
    res.redirect("/admin/all-pages");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//========================================================================== Delete Page Controller Function
const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).send("page not found");
    }

    const imagePath = path.join(__dirname, "../../uploads", page.pageImage);
    try {
      fs.unlinkSync(imagePath); // Delete the page image
    } catch (err) {
      console.error("Error deleting image:", err);
    }

    await Page.findByIdAndDelete(req.params.id); // Delete the page from the database
    req.session.message = {
      type: "success",
      message: "Page deleted successfully!",
    };
    res.redirect("/admin/all-pages");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//========================================================================== Exporting Controller Functions
module.exports = {
  addPage,
  addPageView,
  allPages,
  updatePage,
  deletePage,
  updatePageView,
};
