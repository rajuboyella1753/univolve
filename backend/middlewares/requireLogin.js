const requireLogin = (req, res, next) => {
  req.user = {
    _id: "666111222333444abc123def",
    name: "StudentUser",
    branch: "CSE",
    year: "3rd Year",
  };
  next();
};

module.exports = requireLogin;
