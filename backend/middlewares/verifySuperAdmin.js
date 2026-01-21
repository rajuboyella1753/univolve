// backend/middleware/isSuperAdmin.js
const isSuperAdmin = (req, res, next) => {
  const { role, subrole } = req.user;

  if (role === "admin" && subrole === "superadmin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Super Admins only." });
  }
};

module.exports = isSuperAdmin;
