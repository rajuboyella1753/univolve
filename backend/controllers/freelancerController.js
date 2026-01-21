const Freelancer = require("../models/Freelancer");

exports.registerFreelancer = async (req, res) => {
  try {
    const { name, category, description, contact } = req.body;
    const samples = req.files.map((file) => file.path);

    const newFreelancer = new Freelancer({
      user: req.user._id,
      name,
      category,
      description,
      contact,
      samples,
    });

    await newFreelancer.save();
    res.status(201).json({ message: "Freelancer registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.getFreelancers = async (req, res) => {
  try {
    const { q } = req.query; // extract search query

    const query = q
      ? {
          $or: [
            { name: new RegExp(q, "i") },
            { category: new RegExp(q, "i") },
            { description: new RegExp(q, "i") },
          ],
        }
      : {}; // if no search term, get all

    const freelancers = await Freelancer.find(query).populate("user", "name email");
    res.json(freelancers);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Server error while fetching freelancers" });
  }
};
