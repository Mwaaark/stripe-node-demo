const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  image: String,
  description: String,
  targetAmount: Number,
  createdAt: { type: Date, default: Date.now },
  donations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Donation",
    },
  ],
});

module.exports = mongoose.model("Project", ProjectSchema);
