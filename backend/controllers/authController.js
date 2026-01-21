const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signupUser = async (req, res) => {
  let { name, email, password, role, subrole, gender } = req.body;

  console.log("📥 Incoming Signup Request:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Role:", role);
  console.log("Subrole:", subrole);

  try {
    // 🔁 Normalize role and subrole
    role = role.toLowerCase();
    subrole = subrole.toLowerCase().replace(/\s/g, "");

    // 🔒 Block fake superadmin signup
    if (role === "admin" && subrole === "superadmin" && email !== "rajuboyella737@sudara.org") {
      return res.status(403).json({ message: "❌ Only Raju can register as Super Admin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    
const isStudent = role === "student";

const user = new User({
  name,
  email,
  password: hashedPassword,
  role,
  subrole,
  gender,
  approved: isStudent ? true : false, // ✅ auto approve students
  rejected: false,
});


    await user.save();
    res.status(201).json({ message: "User created successfully. Awaiting approval." });

  } catch (err) {
    console.error("🔥 Signup Error:", err);
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password, role, subrole } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (role === "admin" && subrole === "superadmin" && email !== "rajuboyella737@sudara.org") {
      return res.status(403).json({ error: "Only Raju can login as Super Admin" });
    }

    if (user.role !== role || user.subrole !== subrole) {
      return res.status(400).json({ error: "Incorrect role or subrole" });
    }

if (!user.approved && user.role !== "student" && !(user.role === "admin" && user.subrole === "superadmin")) {
  return res.status(403).json({ error: "Account not approved yet" });
}



    if (user.rejected) {
  return res.status(403).json({ error: "Super Admin has rejected your request." });
}

    // ✅ JWT Token Creation
   const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    subrole: user.subrole, // 🔥 Important!
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

  console.log("✅ Logged in as:", user.name, "-", user.role, "-", user.subrole);
    // ✅ Return success
    return res.status(200).json({ token, user });

  } catch (err) {
    console.error("LOGIN ERROR:", err); // 👈 Very important!
    return res.status(500).json({ error: "Login error", detail: err.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile fetch failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};