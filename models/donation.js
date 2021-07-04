const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
