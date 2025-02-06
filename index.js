// Load environment variables
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const Page = require("./models/pageModel");
const {
  SiteSettingData,
  AllDoctorsData,
  AllServices,
} = require("./common/common");

const app = express();

// Define the port
const port = process.env.PORT;
const host = process.env.HOST;

// Connect to the MongoDB database
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for handling sessions
app.use(
  session({
    secret: process.env.SECRET_KEY || "sumitChouhan786", // Use a fallback secret key if not in .env
    saveUninitialized: true,
    resave: false,
  })
);

// Middleware to handle flash messages
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Middleware to fetch site settings globally
app.use(async (req, res, next) => {
  try {
    const siteSettings = await SiteSettingData();
    res.locals.siteSettings = siteSettings;
    next();
  } catch (err) {
    console.error("Error in site settings middleware:", err);
    next();
  }
});

// Middleware to fetch site settings globally
app.use(async (req, res, next) => {
  try {
    const allDoctors = await AllDoctorsData();
    res.locals.allDoctors = allDoctors;
    next();
  } catch (err) {
    console.error("Error in site settings middleware:", err);
    next();
  }
});
// Middleware to fetch site settings globally
app.use(async (req, res, next) => {
  try {
    const services = await AllServices();
    res.locals.services = services;
    next();
  } catch (err) {
    console.error("Error in site settings middleware:", err);
    next();
  }
});
app.use("/", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

// Dynamic page route (should come after other routes)
app.get("/:url", (req, res) => {
  const url = req.params.url;
  console.log("Requested URL:", url);

  Page.findOne({ url, status: "active" })
    .then((page) => {
      if (page) {
        console.log("Page Data:", page);
        res.render("ui/dynamicPage.ejs", {
          name: page.name,
          heading: page.heading,
          description: page.description,
          seoTitle: page.seoTitle,
          seoKeywords: page.seoKeywords,
          seoDescription: page.seoDescription,
          pageImage: page.pageImage,
        });
      } else {
        console.log("Page not found for URL:", url);
        res.status(404).render("ui/error", { title: "Page Not Found" });
      }
    })
    .catch((err) => {
      console.error("Error finding page:", err);
      res.status(500).send("Error: " + err.message);
    });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve static files (e.g., uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set EJS as the template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Catch-all route for undefined routes (404 error page)
app.all("*", (req, res) => {
  res.render("ui/404", { title: "Delhi Hospital" });
});

// Start the server
app.listen(port, host, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
