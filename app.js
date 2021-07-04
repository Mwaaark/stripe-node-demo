if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const projectRoutes = require("./routes/projects-routes");
const donationRoutes = require("./routes/donations-routes");

const { webhookCheckout } = require("./controllers/donations-controllers");

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

// STRIPE WEBHOOK
app.post(
  "/projects/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/projects", projectRoutes);
app.use("/projects/:id/donations", donationRoutes);

app.get("/", (req, res) => {
  res.redirect("/projects");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
