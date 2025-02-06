const express = require("express");
const router = express.Router();
const {
  getAllDoctorsForIndex,
  getDoctor,
} = require("../controllers/doctorController");
const { SliderPageForIndex } = require("../controllers/sliderController");
const { getAllServicesForIndex, getService } = require("../controllers/ServicesController");
const { getAllBlogsForIndex, getBlog } = require("../controllers/blogController");
const {
  getAllTestimonialsForIndex,
} = require("../controllers/testimonialController");
const {
  getAllDepartmentsForIndex,
} = require("../controllers/departmentController");
const { createAppointment } = require("../controllers/appointmentController");
const landingPageSlider = require("../controllers/landingSliderController");
const landingEnquriController = require("../controllers/landingEnquriController");

// =================================================== homepage with doctors, sliders, services, and blogs
router.get("/", async (req, res) => {
  try {
    // Fetch all doctors and sliders
    const [doctors, sliders, services, blogs] = await Promise.all([
      getAllDoctorsForIndex(),
      SliderPageForIndex(),
      getAllServicesForIndex(),
      getAllBlogsForIndex(),
    ]);

    res.render("../views/ui/index.ejs", {
      title: "Hospital",
      doctors: doctors,
      blogs: blogs,
      sliders: sliders,
      services: services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctors and sliders.");
  }
});

//===================================================================== blog page with all blogs
router.get("/blog", async (req, res) => {
  try {
    const blogs = await getAllBlogsForIndex();
    res.render("../views/ui/blog.ejs", { blogs, title: "Hospital" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching blogs.");
  }
});


// ====================================================================== doctor page with all doctors
router.get("/doctor", async (req, res) => {
  try {
    const doctors = await getAllDoctorsForIndex();
    res.render("../views/ui/doctor.ejs", { doctors, title: "Hospital" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctors.");
  }
});

// =================================================================== services page with all services
router.get("/service", async (req, res) => {
  try {
    const services = await getAllServicesForIndex();
    res.render("../views/ui/service.ejs", { services, title: "Hospital" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching services.");
  }
});

// =================================================================== services, testimonials, and blogs
router.get("/about", async (req, res) => {
  try {
    const [services, testimonials, blogs] = await Promise.all([
      getAllServicesForIndex(),
      getAllTestimonialsForIndex(),
      getAllBlogsForIndex(),
    ]);

    res.render("ui/about", {
      title: "Hospital",
      services,
      testimonials,
      blogs,
    });
  } catch (err) {
    console.error("Error fetching data for about page:", err.message);

    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the About page.",
    });
  }
});

//====================================================================== departments page with all departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await getAllDepartmentsForIndex();
    res.render("../views/ui/departments.ejs", {
      departments,
      title: "Hospital",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching departments.");
  }
});

// ====================================================================== Appointment Routes 

router.get("/appointment", async (req, res) => {
  try {
    // Fetch doctors and services
    const [doctors, services] = await Promise.all([
      getAllDoctorsForIndex(),
      getAllServicesForIndex(),
    ]);

    // Render the appointment page
    res.render("../views/ui/appointment.ejs", {
      title: "Book an Appointment",
      doctors: doctors,
      services: services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctors and services.");
  }
});
router.get("/doctor-details/:id?", async (req, res) => {
  try {
    // Fetch doctors and services
    const [doctors, services] = await Promise.all([
      getAllDoctorsForIndex(),
      getAllServicesForIndex(),
    ]);

    if (req.params.id) {
      // If doctor ID is provided, fetch details for that specific doctor
      const doctorId = req.params.id;
      const doctor = await getDoctor(doctorId);

      // Render the doctor details page
      res.render("ui/doctor-details.ejs", {
        doctor: doctor,
        doctors: doctors,
        services: services,
        title: "Delhi Hospital",
      });
    } else {
      // If no doctor ID is provided, render the page with all doctors and services
      res.render("ui/doctor-details.ejs", {
        doctors: doctors,
        services: services,
        title: "Book an Appointment",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctors and services.");
  }
});


// Static route for rendering the service page (without dynamic data)
router.get("/service", (req, res) => {
  res.render("ui/service.ejs", { title: "Delhi Hospital" });
});

// Static route for rendering the service details page
router.get("/service-details/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await getService(serviceId);

    // Fetch blog details
    const blogs = await getAllBlogsForIndex();
    console.log("Service Details:", service);
    console.log("Blogs:", blogs);

    // Render the service details page with blogs
    res.render("ui/service-details.ejs", {
      service,
      blogs,
      title: "Delhi Hospital",
    });
  } catch (err) {
    console.error("Error fetching service details:", err.message);

    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the service details page.",
    });
  }
});



// Static route for rendering the blog details page
router.get("/blog-details/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    // Fetch the specific blog details by ID
    const blog = await getBlog(blogId);

    // Fetch all blogs to display below the blog details
    const blogs = await getAllBlogsForIndex();

    console.log("Blog Details:", blog);
    console.log("All Blogs:", blogs);

    // Render the blog details page with all blogs
    res.render("ui/blog-details.ejs", {
      blog,
      blogs,
      title: "Delhi Hospital",
    });
  } catch (err) {
    console.error("Error fetching blog details:", err.message);

    // Handle error and render the error page
    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the blog details page.",
    });
  }
});


// Static route for rendering the contact page with doctors and services
router.get("/contact", async (req, res) => {
  try {
    // Fetch services and doctors data
    const [services, doctors] = await Promise.all([
      getAllServicesForIndex(),
      getAllDoctorsForIndex(),
    ]);

    // Render the contact page and pass the data
    res.render("ui/contact.ejs", {
      title: "Delhi Hospital",
      services: services,
      doctors: doctors,
    });
  } catch (err) {
    console.error("Error fetching data for contact page:", err.message);
    res.status(500).send("Error fetching data for contact page.");
  }
});


// Route for handling appointment creation
router.post("/appointment", createAppointment);


// Static route for rendering the FAQ page
router.get("/faq", (req, res) => {
  res.render("ui/faq.ejs", { title: "Delhi Hospital" });
});

// Static route for rendering the testimonials page
router.get("/testimonials", (req, res) => {
  res.render("ui/testimonials.ejs", { title: "Delhi Hospital" });
});

// Static route for rendering the terms and conditions page
router.get("/terms-condition", (req, res) => {
  res.render("ui/terms-condition.ejs", { title: "Delhi Hospital" });
});

// Static route for rendering the privacy policy page
router.get("/privacy-policy", (req, res) => {
  res.render("ui/privacy-policy.ejs", { title: "Delhi Hospital" });
});


router.get("/landing", async (req, res) => {
  try {
    const [SliderLanding, services, doctors, blogs] = await Promise.all([
      landingPageSlider.SliderLandingPageForIndex(),
      getAllServicesForIndex(),
      getAllDoctorsForIndex(),
      getAllBlogsForIndex(),
    ]);

    console.log("Fetched sliders:", SliderLanding); // Log the fetched data

    res.render("ui/landing.ejs", {
      title: "Delhi Hospital",
      SliderLanding: SliderLanding,
      services: services,
      doctors: doctors,
      blogs: blogs,
    });
  } catch (err) {
    console.error("Error fetching data for landing page:", err.message);
    res.status(500).send("Error fetching data for landing page.");
  }
});

// Route for handling appointment creation
router.post("/landingAppointment", landingEnquriController.createAppointment);


module.exports = router;
