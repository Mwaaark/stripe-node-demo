const mongoose = require("mongoose");
const Project = require("./models/project");
const Donation = require("./models/donation");

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

const seedDB = async () => {
  await Project.deleteMany({});
  await Donation.deleteMany({});
  for (let i = 0; i < 3; i++) {
    const project = new Project({
      title: `Integer lobortis pulvinar ${i + 1}`,
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
      description:
        "Mauris placerat porttitor erat egestas ullamcorper. Morbi non leo aliquet, placerat ante at, finibus eros. Nam rhoncus nibh quis laoreet consequat.",
      targetAmount: 30000,
    });

    for (let j = 0; j < 3; j++) {
      const donation = new Donation({
        amount: j + 50,
      });

      project.donations.push(donation);

      await donation.save();
    }

    await project.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
