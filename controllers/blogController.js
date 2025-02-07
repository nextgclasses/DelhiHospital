const Blog = require("../models/blogModel");
const path = require("path");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//======================================================================== Add Blog controller function
const addBlog = async (req, res) => {

  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }

  const response=await uploadOnCloudinary(req.file.filename)

  try {
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      // blogImage: req.file.filename,
      blogImage:response,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
    });

    await blog.save();
    req.session.message = {
      type: "success",
      message: "Blog added successfully!",
    };
    res.redirect("/admin/allBlogs");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Add Blog page
const addBlogPage = (req, res) => {
  res.render("add_blog", { title: "Add Blog" });
};

//======================================================================== Render Update Blog page
const updateBlogPage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.render("update_blog", {
      title: "Update Blog",
      blog: blog,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//======================================================================== Update Blog controller function
const updateBlog = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      const response = await uploadOnCloudinary(req.file.filename)

      new_image = response;
   
    } else {
      new_image = req.body.old_image;
    }

    //======================================================================== Update the blog with the new or old image
    await Blog.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
      blogImage: new_image,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
    });

    //======================================================================== Set success message in session and redirect
    req.session.message = {
      type: "success",
      message: "Blog updated successfully!",
    };
    res.redirect("/admin/allBlogs");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Delete Blog controller function
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
 
    await Blog.findByIdAndDelete(req.params.id);
    req.session.message = {
      type: "success",
      message: "Blog deleted successfully!",
    };
    res.redirect("/admin/allBlogs");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== All Blogs Page controller function
const allBlogsPage = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.render("all_blog.ejs", { title: "All Blogs", blogs: blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching blogs.");
  }
};

//======================================================================== All Blogs for Index Page controller function
const allBlogsPageForIndex = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.render("../views/ui/index.ejs", {
      title: "All Blogs",
      blogs: blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching blogs.");
  }
};

//======================================================================== Blogs Page for Index controller function
const blogsPageForIndex = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.render("../views/ui/blog.ejs", {
      title: "All Blogs",
      blogs: blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching blogs.");
  }
};

// ======================================================================== show blogs on ui
const getAllBlogsForIndex = async () => {
  try {
    return await Blog.find();
  } catch (err) {
    throw new Error("Error fetching blogs");
  }
};

// ======================================================================== show blogs on ui
const getBlog = async (blogId) => {
  try {
    return await Blog.findById(blogId);
  } catch (err) {
    throw new Error("Error fetching blogs");
  }
};

// Export the functions
module.exports = {
  addBlogPage,
  getAllBlogsForIndex,
  blogsPageForIndex,
  allBlogsPageForIndex,
  addBlog,
  updateBlogPage,
  updateBlog,
  allBlogsPage,
  deleteBlog,
  getBlog
};
