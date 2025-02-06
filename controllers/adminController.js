const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

//======================================================================== Render Signup Page
const renderSignUp = (req, res) => {
  res.render("signup", { title: "Admin Signup", error: null });
};

//======================================================================== Handle Signup
const handleSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.render("signup", {
        title: "Admin Signup",
        error: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    res.redirect("/admin/login");
  } catch (error) {
    console.error(error);
    res.render("signUp", {
      title: "Admin Signup",
      error: "Something went wrong",
    });
  }
};

//======================================================================== Render Login Page
const renderLogin = (req, res) => {
  res.render("login", { title: "Admin Login", error: null });
};

//======================================================================== Handle Login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.render("login", {
        title: "Admin Login",
        error: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.render("login", {
        title: "Admin Login",
        error: "Invalid email or password",
      });
    }
    req.session.admin = { id: admin._id, name: admin.name };
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.render("login", {
      title: "Admin Login",
      error: "Something went wrong",
    });
  }
};

//======================================================================== Render Dashboard Page
const renderDashboard = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  res.render("admin_panel", {
    title: "Admin Dashboard",
    admin: req.session.admin,
  });
};

//======================================================================== Render Update Password Page
const renderUpdate = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  res.render("update", { title: "Update Password", error: null });
};

//======================================================================== Handle Update Password
const handleUpdatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.session.admin.id);
    if (!admin) {
      return res.redirect("/admin/login");
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isPasswordValid) {
      return res.render("update", {
        title: "Update Password",
        error: "Current password is incorrect",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.render("update", {
      title: "Update Password",
      error: "Something went wrong",
    });
  }
};

//======================================================================== Handle Logout
const handleLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
};

//======================================================================== Exporting all functions
module.exports = {
  renderSignUp,
  handleSignUp,
  renderLogin,
  handleLogin,
  renderDashboard,
  renderUpdate,
  handleUpdatePassword,
  handleLogout,
};
