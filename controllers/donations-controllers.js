const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Project = require("../models/project");
const Donation = require("../models/donation");

const webhookCheckout = (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("test webhook");
  }
};

const createCheckoutSession = async (req, res) => {
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
};

module.exports = {
  webhookCheckout,
  createCheckoutSession,
};
