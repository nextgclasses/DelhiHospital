const isAuthenticated = (req, res, next) => {
  if (!req.session.admin) {
    console.log(
      `Unauthorized access attempt on ${req.originalUrl} at ${new Date()}`
    );
    return res.redirect("/admin/login");
  }

  console.log("Admin authenticated:", req.session.admin); // Debug
  next();
};

module.exports = isAuthenticated;
