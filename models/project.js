const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  image: String,
  description: String,
  targetAmount: Number,
  raisedAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Project", ProjectSchema);
