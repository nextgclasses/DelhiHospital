const Department = require("../models/departmentModel");
const path = require("path");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//======================================================================== Add Department 
const addDepartment = async (req, res) => {
  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }
  const response = await uploadOnCloudinary(req.file.filename)

  try {
    const department = new Department({
      title: req.body.title,
      description: req.body.description,
      departmentImage: response,
    });

    await department.save();
    req.session.message = {
      type: "success",
      message: "Department added successfully!",
    };
    res.redirect("/admin/allDepartments");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Add Department page
const addDepartmentPage = (req, res) => {
  res.render("add_department", { title: "Add Department" });
};

//======================================================================== Update Department controller function
const updateDepartmentPage = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.render("update_departments", {
      title: "Update Department",
      department: department,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//======================================================================== Update the department with the new details
const updateDepartment = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      const response = await uploadOnCloudinary(req.file.filename)

      new_image = response;

    } else {
      new_image = req.body.old_image;
    }

    await Department.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
      departmentImage: new_image,
    });
    req.session.message = {
      type: "success",
      message: "Department updated successfully!",
    };
    res.redirect("/admin/allDepartments");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Delete Department controller function
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).send("Department not found");
    }


    await Department.findByIdAndDelete(req.params.id);

    req.session.message = {
      type: "success",
      message: "Department deleted successfully!",
    };
    res.redirect("/admin/allDepartments");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== All Departments Page controller function
const allDepartmentsPage = async (req, res) => {
  try {
    const departments = await Department.find();

    res.render("all_departments.ejs", {
      title: "All Departments",
      departments: departments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching departments.");
  }
};
// ======================================================================== get all departments for show in ui
const getAllDepartmentsForIndex = async () => {
  try {
    return await Department.find();
  } catch (err) {
    throw new Error("Error fetching departments");
  }
};

module.exports = {
  getAllDepartmentsForIndex,
  addDepartmentPage,
  addDepartment,
  updateDepartmentPage,
  updateDepartment,
  allDepartmentsPage,
  deleteDepartment,
};
