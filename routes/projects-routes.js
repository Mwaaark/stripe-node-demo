const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  createProject,
  renderNewForm,
  showProject,
} = require("../controllers/projects-controllers");

router.route("/").get(getAllProjects).post(createProject);

router.get("/new", renderNewForm);

router.get("/:id", showProject);

module.exports = router;
