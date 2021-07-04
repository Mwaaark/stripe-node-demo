const Project = require("../models/project");

const getAllProjects = async (req, res) => {
  const projects = await Project.find();

  res.render("projects/index", { projects });
};

const createProject = async (req, res) => {
  const { title, image, description, targetAmount } = req.body;

  const project = await new Project({
    title,
    image,
    description,
    targetAmount,
  });

  await project.save();

  res.redirect("/projects");
};

const renderNewForm = (req, res) => {
  res.render("projects/new");
};

const showProject = async (req, res) => {
  if (req.query.success) {
    console.log("success");
  }

  if (req.query.cancel) {
    console.log("cancel");
  }

  const project = await Project.findById(req.params.id).populate("donations");

  res.render("projects/show", { project });
};

module.exports = {
  getAllProjects,
  createProject,
  renderNewForm,
  showProject,
};
