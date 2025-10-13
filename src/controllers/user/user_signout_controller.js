const userSignOut = (req, res) => {
  req.session = null;
  res
    .status(200)
    .json({ message: "you have been successfully logged out now" });
};

module.exports = userSignOut;
