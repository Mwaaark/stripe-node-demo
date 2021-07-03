if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const ejsMate = require("ejs-mate");

const Project = require("./models/project");

const dbUrl =
  process.env.DATABASE_URL || "mongodb://localhost:27017/stripe-node-demo";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/projects");
});

app.get("/projects", async (req, res) => {
  const projects = await Project.find();

  res.render("projects/index", { projects });
});

app.get("/projects/new", (req, res) => {
  res.render("projects/new");
});

app.post("/projects", async (req, res) => {
  const { title, image, description, targetAmount } = req.body;

  const project = await new Project({
    title,
    image,
    description,
    targetAmount,
  });

  await project.save();

  res.redirect("/projects");
});

app.get("/projects/:id", async (req, res) => {
  if (req.query.success) {
    console.log("success");
  }

  if (req.query.cancel) {
    console.log("cancel");
  }

  const project = await Project.findById(req.params.id);

  res.render("projects/show", { project });
});

app.post("/projects/:id/create-checkout-session", async (req, res) => {
  const { donationAmount } = req.body;

  const project = await Project.findById(req.params.id);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "php",
          product_data: {
            name: project.title,
            images: [project.image],
          },
          unit_amount: +donationAmount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.DOMAIN_NAME}/projects/${req.params.id}?success=true`,
    cancel_url: `${process.env.DOMAIN_NAME}/projects/${req.params.id}?cancel=true`,
  });

  res.redirect(303, session.url);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
