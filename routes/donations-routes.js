const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createCheckoutSession,
} = require("../controllers/donations-controllers");

router.post("/", createCheckoutSession);

module.exports = router;
